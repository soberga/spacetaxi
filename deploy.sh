#!/bin/bash
npm install
npm run build
scp dist/index.html soberga@scp.domeneshop.no:/www/spacetaxi/