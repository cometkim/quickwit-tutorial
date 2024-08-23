#!/bin/bash

quickwit index create --overwrite --yes \
  --endpoint http://quickwit:7280 \
  --index-config /quickwit/index-config.yml

curl "https://quickwit-datasets-public.s3.amazonaws.com/stackoverflow.posts.transformed-10000.json" | \
  quickwit index ingest \
    --endpoint http://quickwit:7280 \
    --index stackoverflow
