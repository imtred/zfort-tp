#!/bin/bash
export NODE_ENV='production'
export PORT=80
. ./scripts/boot/database.staging.sh
node ./api/app
