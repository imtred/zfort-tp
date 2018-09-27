#!/bin/bash
export NODE_ENV='production'
. ./scripts/boot/database.staging.sh
node ./api/app
