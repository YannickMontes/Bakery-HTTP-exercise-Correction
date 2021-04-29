#!/usr/bin/env bash
npm install
npm uninstall bcrypt
npm install bcrypt
echo "Starting API server"
npm start