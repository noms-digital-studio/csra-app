#!/usr/bin/env bash

# This script requires the 'jq' command line tool
# brew install jq

# Grab the MOCK build
git checkout deploy-to-mock
git pull --rebase

# Push the MOCK build to STAGE
git push --force origin origin/deploy-to-mock:deploy-to-stage

# Wait for STAGE deploy to finish
GIT_REF=`jq -r '.gitRef' build-info.json` APP_BASE_URL=http://csra-stage.hmpps.dsd.io/health yarn wait-for-deploy

# Run the E2E tests against STAGE
APP_BASE_URL=http://csra-stage.hmpps.dsd.io yarn test:integration

# Switch back to master branch
git checkout master
