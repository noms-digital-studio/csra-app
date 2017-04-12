#!/usr/bin/env bash

# Grab the MOCK build
git checkout deploy-to-mock
git pull

# Push the MOCK build to STAGE
git push --force origin HEAD:deploy-to-stage

# Wait for STAGE deploy to finish
GIT_REF=`jq -r '.gitRef' build-info.json` APP_BASE_URL=http://csra-stage.hmpps.dsd.io/health yarn wait-for-deploy

# Run the E2E tests against STAGE
APP_BASE_URL=http://csra-stage.hmpps.dsd.io yarn test:integration



