"use strict";

let config = {
  "includeNodeEnv": true,
  "console": { "enabled": true, "level": "error" },
  "file": {"enabled": false },
  "syslog": {
    "enabled": true,
    "level": "debug",
    "port": 3030,
    "server": "logstash",
    "type": "TCP_META"
  }
};

if ( process.argv[2] )
  config.syslog.server = process.argv[2];

let log = require( 'docker-logger' )( config );

log.info( 'docker-logger: This is a simple message' );
log.debug( 'docker-logger: This message has meta:', { foo: "bar" } );
try {
  let a;
  let b = a.x.y;
} catch( err ) {
  log.error( 'docker-logger: This is a caught exception:', err );
}
let a;
let b = a.m.n;
log.info( 'docker-logger: The preceeding was an uncaught exception' );
