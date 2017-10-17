#!/usr/bin/env bash
set -e

if [ $# -lt 3 ]
  then
    echo "usage: promote-from-mock-to-stage.sh <stage db password> <DEV Nomis username> <DEV Nomis password>"
    exit
fi

# Grab the MOCK build
git checkout deploy-to-mock
git pull --rebase

# Push the MOCK build to STAGE
git push --force origin origin/deploy-to-mock:deploy-to-stage

# Wait for STAGE deploy to finish
GIT_REF=`cat build-info.json | python -c 'import json,sys;print json.load(sys.stdin)["gitRef"]'`\
 WAIT_DURATION=45000 APP_BASE_URL=http://csra-stage.hmpps.dsd.io/health yarn wait-for-deploy

# Run the E2E tests against STAGE
TEST_USER_NAME=$2 \
TEST_USER_PASSWORD=$3 \
DB_URI_TESTS=mssql://csra:$1@csra-stage.database.windows.net:1433/csra-stage \
APP_BASE_URL=https://csra-stage.hmpps.dsd.io yarn test:e2e

# Switch back to master branch
git checkout master
