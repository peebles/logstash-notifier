//
// Send continuous log messages, so we can test emailer
//
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

setInterval( function() {
  log.error( 'This is an error', { meta: 'data', value: 'val1' } );
  log.info( 'This is informational', { lastname: 'peebles' } );
}, 10 * 1000 );
