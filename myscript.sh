#!/bin/bash

node maaCast/src/app.js &

cd /app/filebeat/

./filebeat -e 


sleep 300
