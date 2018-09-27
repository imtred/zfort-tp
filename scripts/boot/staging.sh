#!/bin/bash
export NODE_ENV='production'
export PORT=8080
. ./scripts/boot/database.staging.sh
node ./api/app
