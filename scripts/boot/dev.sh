#!/bin/bash
export NODE_ENV=development
export PORT=4000
. ./scripts/boot/database.dev.sh
node ./api/app
