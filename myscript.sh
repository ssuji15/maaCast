#!/bin/bash

node maaCast/main.js &

cd /app/filebeat/

./filebeat -e 


sleep 300
