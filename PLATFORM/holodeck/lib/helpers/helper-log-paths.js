"use strict";

var mkdirp = require("mkdirp");

var path = require("path");

function getLogDir(logsRootDir_) {
  mkdirp(logsRootDir_);
  return logsRootDir_;
}

;

function getRunnerEvalSummaryFilename(logsRootDir_, runnerID_) {
  return path.join(getLogDir(logsRootDir_), "summary-".concat(runnerID_, ".json"));
}

;

function getRunnerInducedGitDiffsFilename(logsRootDir_, runnerID_) {
  return path.join(getLogDir(logsRootDir_), "induced-git-diffs-".concat(runnerID_, ".json"));
}

;

function getRunnerResponseFilename(logsRootDir_, runnerID_) {
  return path.join(getLogDir(logsRootDir_), "runner-response-".concat(runnerID_, ".json"));
}

;

function getLogEvalDir(logsRootDir_) {
  var dirPath = path.join(getLogDir(logsRootDir_), "eval");
  mkdirp(dirPath);
  return dirPath;
}

;

function getHarnessEvalFilename(logsRootDir_, testID_) {
  return path.join(getLogEvalDir(logsRootDir_), "".concat(testID_, ".json"));
}

;

function getHarnessEvalDiffFilename(logsRootDir_, testID_) {
  return path.join(getLogEvalDir(logsRootDir_), "".concat(testID_, "-git-diff"));
}

;

function getHarnessEvalDiffChangeLinesFilename(logsRootDir_, testID_) {
  return path.join(getLogEvalDir(logsRootDir_), "".concat(testID_, "-change-lines"));
}

;

function getHarnessEvalDiffTreeFilename(logsRootDir_, testID_) {
  return path.join(getLogEvalDir(logsRootDir_), "".concat(testID_, "-git-diff-tree"));
}

;
module.exports = {
  getLogDir: getLogDir,
  getRunnerEvalSummaryFilename: getRunnerEvalSummaryFilename,
  getRunnerInducedGitDiffsFilename: getRunnerInducedGitDiffsFilename,
  getRunnerResponseFilename: getRunnerResponseFilename,
  getLogEvalDir: getLogEvalDir,
  getHarnessEvalFilename: getHarnessEvalFilename,
  getHarnessEvalDiffFilename: getHarnessEvalDiffFilename,
  getHarnessEvalDiffChangeLinesFilename: getHarnessEvalDiffChangeLinesFilename,
  getHarnessEvalDiffTreeFilename: getHarnessEvalDiffTreeFilename
};