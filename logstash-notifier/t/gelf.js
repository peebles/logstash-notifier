"use strict";

let winston = require('winston');

let config = {
  level: 'debug',
  graylog: {
    servers: [{ host: 'logstash', port: 12201 }]
  }
};

if ( process.argv[2] )
  config.graylog.servers[0].host = process.argv[2];

console.log( JSON.stringify( config, null, 2 ) );

winston.add(require('winston-graylog2'), config );

let log = winston;

log.info( 'graylog: This is a simple message' );
log.debug( 'graylog: This message has meta:', { foo: "bar" } );
//try {
//  let a;
//  let b = a.x.y;
//} catch( err ) {
//  log.error( 'graylog: This is a caught exception:', err );
//}

