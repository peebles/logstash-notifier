## Data Formats

Two data formats are supported coming in.  Both are JSON formatted strings
coming in as TCP messages (from logstash).  One is the so-called "meta"
format coming from `docker-logger` and the other is "syslog".

### Meta

```javascript
{
  "@timestamp": "2017-07-25T16:42:08.922Z",
  "level": "debug",
  "meta": {
    "foo": "bar"
  },
  "host": "fc1772754b09",
  "program": "app",
  "message": "This message has meta:"
}
```

### Syslog
