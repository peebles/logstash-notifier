istepanov/backup-to-s3
======================

Docker container that periodically backups files to Amazon S3 using [s3cmd sync](http://s3tools.org/s3cmd-sync) and cron.

This is a modification of [istepanov/backup-to-s3](https://github.com/istepanov/docker-backup-to-s3) which syncs a file
or directory to the same bucket/path every time, with a simple change from [soualid/simple-s3-backup](https://github.com/soualid/simple-s3-backup)
which supports taking a snapshot, but didn't support cron.

So this version can sync, or take snapshots.  It supports cron.  It also supports encryption at rest.

### Usage

    docker build -t backup-to-s3 .
    docker run -d [OPTIONS] backup-to-s3

### Parameters:

* `-e ACCESS_KEY=<AWS_KEY>`: Your AWS key.
* `-e SECRET_KEY=<AWS_SECRET>`: Your AWS secret.
* `-e S3_PATH=s3://<BUCKET_NAME>/<PATH>/`: S3 Bucket name and path. Should end with trailing slash.
* `-v /path/to/backup:/data:ro`: mount target local folder to container's data folder. Content of this folder will be synced with S3 bucket.

The `S3_PATH` can include a "-currentdate-" and if it does, that string will be replaced with the current date.  This in effect gives you
snapshots instead of syncing over the same backup.

### Optional parameters:

* `-e PARAMS="--dry-run"`: parameters to pass to the sync command ([full list here](http://s3tools.org/usage)).
* `-e DATA_PATH=/data/`: container's data folder. Default is `/data/`. Should end with trailing slash.
* `-e 'CRON_SCHEDULE=0 1 * * *'`: specifies when cron job starts ([details](http://en.wikipedia.org/wiki/Cron)). Default is `0 1 * * *` (runs every day at 1:00 am).
* `no-cron`: run container once and exit (no cron scheduling).

**Note**: Set `PARAMS` to "--server-side-encryption" to get encryption at rest.  You can add "--server-side-encryption-kms-id=KMS_KEY" if 
you want to manage your own keys.  Otherwise the default keys from your account will be used.

### Examples:

Run upload to S3 everyday at 12:00pm:

    docker run -d \
        -e ACCESS_KEY=myawskey \
        -e SECRET_KEY=myawssecret \
        -e S3_PATH=s3://my-bucket/backup/ \
        -e 'CRON_SCHEDULE=0 12 * * *' \
        -v /home/user/data:/data:ro \
        backup-to-s3

Run once then delete the container:

    docker run --rm \
        -e ACCESS_KEY=myawskey \
        -e SECRET_KEY=myawssecret \
        -e S3_PATH=s3://my-bucket/backup/ \
        -v /home/user/data:/data:ro \
        backup-to-s3 no-cron

Run once to get from S3 then delete the container:

    docker run --rm \
        -e ACCESS_KEY=myawskey \
        -e SECRET_KEY=myawssecret \
        -e S3_PATH=s3://my-bucket/backup/ \
        -v /home/user/data:/data:rw \
        backup-to-s3 get

Run once to delete from s3 then delete the container:

    docker run --rm \
        -e ACCESS_KEY=myawskey \
        -e SECRET_KEY=myawssecret \
        -e S3_PATH=s3://my-bucket/backup/ \
        backup-to-s3 delete

Security considerations: on restore, this opens up permissions on the restored files widely.
