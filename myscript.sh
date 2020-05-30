#!/bin/bash

node main.js &

cd /app/filebeat/

./filebeat -e 


sleep 300
