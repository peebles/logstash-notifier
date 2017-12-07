#!/bin/bash

set -e

echo "Job started: $(date)"

currentDate=$(date +%F_%R)
currentDate=${currentDate/:/-}
S3_PATH=${S3_PATH/-currentdate-/$currentDate}
echo "s3cmd sync $PARAMS $DATA_PATH $S3_PATH"

/usr/local/bin/s3cmd sync $PARAMS "$DATA_PATH" "$S3_PATH"

echo "Job finished: $(date)"
