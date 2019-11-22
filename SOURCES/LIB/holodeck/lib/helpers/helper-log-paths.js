
const mkdirp = require("mkdirp");
const path = require("path");

function getLogDir(logsRootDir_) {
    mkdirp(logsRootDir_);
    return logsRootDir_;
};

function getRunnerEvalSummaryFilename(logsRootDir_, runnerID_) {
    return path.join(getLogDir(logsRootDir_), `${runnerID_}-runner-summary.json`);
};

function getRunnerInducedGitDiffsFilename(logsRootDir_, runnerID_) {
    return path.join(getLogDir(logsRootDir_), `${runnerID_}-runner-induced-git-diffs.json`);
};

function getRunnerResponseFilename(logsRootDir_, runnerID_) {
    return path.join(getLogDir(logsRootDir_), `${runnerID_}-runner-response.json`);
};

function getLogEvalDir(logsRootDir_, runnerID_) {
    const dirPath = path.join(getLogDir(logsRootDir_), `${runnerID_}-eval`);
    mkdirp(dirPath);
    return dirPath;
};

function getHarnessEvalFilename(logsRootDir_, runnerID_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_, runnerID_), `${testID_}.json`);
};

function getHarnessEvalDiffFilename(logsRootDir_, runnerID_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_, runnerID_), `${testID_}-git-diff`);
};

function getHarnessEvalDiffChangeLinesFilename(logsRootDir_, runnerID_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_, runnerID_), `${testID_}-change-lines`);
};

function getHarnessEvalDiffTreeFilename(logsRootDir_, runnerID_, testID_) {
    return path.join(getLogEvalDir(logsRootDir_, runnerID_), `${testID_}-git-diff-tree`);
};

module.exports = {
    getLogDir,
    getRunnerEvalSummaryFilename,
    getRunnerInducedGitDiffsFilename,
    getRunnerResponseFilename,
    getLogEvalDir,
    getHarnessEvalFilename,
    getHarnessEvalDiffFilename,
    getHarnessEvalDiffChangeLinesFilename,
    getHarnessEvalDiffTreeFilename
};


