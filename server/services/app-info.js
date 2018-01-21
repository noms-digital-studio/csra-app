const path = require('path');
const { execSync } = require('child_process');

const { calculateHash } = require('../../utils/question-hash');

function staticAppInfo(buildInfo) {
  return {
    getBuildInfo() {
      return buildInfo;
    },
    getGitRef() {
      return buildInfo.gitRef;
    },
    getGitDate() {
      return new Date(buildInfo.gitDate);
    },
    getQuestionHash(type) {
      return buildInfo.questionHash[type];
    },
  };
}

function execGit(args) {
  return execSync(`git ${args}`, {
    cwd: path.resolve(__dirname, '../..'),
    env: {
      PATH: process.env.PATH,
      TZ: 'UTC',
    },
    encoding: 'utf-8',
  }).trim();
}

function dynamicAppInfo() {
  function getGitRef() {
    return execGit('log -n1 --format=%H');
  }
  function getGitDate() {
    return new Date(execGit('log -n1 --format=%cd --date=iso'));
  }
  function getBuildInfo() {
    return {
      buildNumber: 'dev',
      gitRef: getGitRef(),
      gitDate: getGitDate(),
      questionHash: {
        risk: calculateHash('risk-assessment'),
        healthcare: calculateHash('healthcare'),
      },
    };
  }
  function getQuestionHash(type) {
    const types = {
      risk: 'risk-assessment',
      healthcare: 'healthcare',
    };
    return calculateHash(types[type]);
  }

  return {
    getBuildInfo, getGitRef, getGitDate, getQuestionHash,
  };
}

module.exports = function createAppInfoService(buildInfo) {
  if (!buildInfo) {
    return dynamicAppInfo();
  }
  return staticAppInfo(buildInfo);
};
