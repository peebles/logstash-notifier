# Logstash Notifier

Here are the problems I am trying to address:

1. I want to get my logs off of my containers and centralize them somewhere.
2. I want to set up search expressions that if met, will send an email to some people.
3. I still want to be able to get at physical ascii log files to grep, sed, awk, etc.
4. I never want to run out of disk space due to logging.  I want my physical logs to be rotated and compressed and thrown away when they get old.

This stack runs `logstash` which is configured to take input from a nodejs client-side library I wrote called
[docker-logger](https://github.com/peebles/docker-logger) and writes to an app (included here) over tcp which handles the alerting and physical
file management.  This app includes a web UX for tailing the logs, searching for events using a Lucene-like syntax, and managing email alerts.

To keep things simple, this stack was coded with docker-logger in mind.  When configured to use "syslog:TCP_META" or "syslog:UDP_META", docker-logger
will send JSON over tcp or udp in the following format:

```javascript
{
  "timestamp": "2017-07-25T16:42:08.922Z",
  "level": "debug",
  "meta": {
    "foo": "bar"
  },
  "host": "fc1772754b09",
  "program": "app",
  "message": "This message has meta:"
}
```

The app here that does alerting and file management assumes JSON structs that look like this.  You *could* use something else besides
docker-logger on your clients, but either your client must send messages using this format, or you must configure logstash to convert your
incoming messages to look like this before sending them out.

You can launch this stack with or without Elasticsearch and Kibana.

## Quick Start

Edit "./config.env".  You will need to change the "PROXY_SMTP_*" variables to point to your own SMTP server.  Then

```bash
docker-compose build
docker-compose up -d
```

The port that `docker-logger` should write to is 3030.  The UX is on 8080 and uses HTTP Basic Auth.  The default username/password is admin/password.

To get to the physical log files:

```bash
docker exec -it logs bash
```

You'll be in the directory containing the logs.  There is an "all.log" that aggregates all of the logs, and individual log files, one for each
application that is writing logs to logstash.

The log files are chopped and compressed by `winston`.

