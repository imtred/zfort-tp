#!/bin/bash
export NODE_ENV=development
export PORT=3000
. ./scripts/boot/database.dev.sh
nodemon ./api/app
