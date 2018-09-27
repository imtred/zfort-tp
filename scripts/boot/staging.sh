#!/bin/bash
export NODE_ENV='production'
export PORT=4000
. ./scripts/boot/database.staging.sh
node ./api/app
