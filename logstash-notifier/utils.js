"use strict";
/*
   log: a logger (ie: log.debug(), log.info(), log.error(), log.warn())
   messageQueue: an aync.queue to push parsed messages to, if ignore is false
 */
let async = require( 'async' );
let byline = require( 'byline' );
let writer = require( './lib/writer' );
let net = require( 'net' );
let _ = require( 'lodash' );

function setupProxyServers( app, messageQueue, cb ) {
  writer.initialize( app.config.logs );

  function parse( msg ) {
    let json = _.cloneDeep( msg );
    json.timestamp = json[ '@timestamp' ] || new Date().toString();
    json.message = '[' + (json.level || json.severity) + '] ' + json.message +
		    (( json.meta && typeof json.meta == 'object' && Object.keys(json.meta).length ) ? ' ' + JSON.stringify(json.meta) : '' );
    return json;
  }

  let server = net.createServer( function( c ) {
    c = byline.createStream( c );
    c.on( 'data', function( line ) {
      try {
	let parsed = JSON.parse( line.toString() );
	writer.write( parsed );
	messageQueue.push( parse( parsed ), function(err) {
	  if ( err ) app.log.error( err );
	});
      } catch( err ) {
	app.log.error( err );
      }
    });
  });

  server.on( 'error', function( err ) {
    app.log.error( 'server encountered ' + err.code + ', restarting in one second...' );
    setTimeout( function() {
      server.close();
      server.listen( 3000 );
    }, 1000 );
  });

  server.listen( 3000, function() {
    app.log.info( 'listening on', 3000 );
  });

  cb();
}

/*
   Setup the database.  The callback returns the database handle.  Uses knex.
 */
function setupDatabase( app, config, cb ) {
  let fs = require( 'fs' );
  let dbfile = config.connection.filename;
  if ( dbfile.match( /^ENV:/ ) ) {
    let envvar = dbfile.split( ':' )[1];
    let def    = dbfile.split( ':' )[2];
    dbfile = ( process.env[ envvar ] || def );
    config.connection.filename = dbfile;
  }
  if ( ! fs.existsSync( dbfile ) ) {
    let path = require( 'path' );
    let mkdirp = require( 'mkdirp' );
    mkdirp.sync( path.dirname( dbfile ) );
    var schema = [
      "create table if not exists events (id integer primary key,  name varchar(128),  regex  varchar(128) not NULL);",
      "create table if not exists users (id integer primary key,  email varchar(48) not NULL,  freq integer default 10,  sentto integer default 0,  event_id   integer,  constraint fk_users1 foreign key(event_id) references events(id) on delete cascade on update cascade);",
      "create table if not exists buffers (  id  integer primary key,  user_id    integer,  event_id   integer,  buffer     text,  count      integer default 0,  created    integer,  buffered   integer,  constraint fk_buffers1 foreign key(user_id) references users(id) on delete cascade on update cascade,  constraint fk_buffers2 foreign key(event_id) references events(id) on delete cascade on update cascade);"
    ];
  }
  config.pool = {
    afterCreate: function( conn, cb ) {
      app.log.debug( 'db connection created' );
      conn.on( 'error', function( err ) {
	app.log.error( 'Uncaught knex error:', err );
      });
    }
  };
  /*
     app.log.debug( JSON.stringify( config, null, 2 ) );
     var db = require( 'knex' )( config );
   */
  let db = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: config.connection.filename
    }
  });
  if ( schema && schema.length ) {
    app.log.warn( 'creating new database into', config.connection.filename );
    async.eachSeries( schema, function( sql, cb ) {
      db.raw( sql ).then( function() {
	cb();
      }).catch( cb );
    }, function( err ) {
      if ( err ) return cb( err );
      cb( null, db );
    });
  }
  else {
    cb( null, db );
  }
}

module.exports = {
  setupDatabase: setupDatabase,
  setupProxyServers: setupProxyServers,
};
