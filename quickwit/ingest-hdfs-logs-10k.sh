#!/bin/bash

quickwit index create --overwrite --yes \
  --endpoint http://quickwit:7280 \
  --index-config /quickwit/index-config.yml

curl "https://quickwit-datasets-public.s3.amazonaws.com/hdfs-logs-multitenants-10000.json" | \
  quickwit index ingest \
    --endpoint http://quickwit:7280 \
    --index hdfs-logs
