// gulp-help-tast.js

const packageMeta = require('../../../package.json');

const helpLines = [
    ("**** " + packageMeta.author.name + "/" + packageMeta.name + " v" + packageMeta.version + " Project Tools Help ****"),
    "From the command prompt, from anywhere within the project repository, execute the following:",
    "$ npm install ..... install 3rd-party open source tools and libraries required to execute the commands below",
    "$ npm run help .... this message",
    "$ npm run app ..... clean, build, deploy, launch the server on localhost",
    "$ npm run build ... clean, build",
    "$ npm run clean ... burn it down",
    "$ npm run deploy .. clean, make the build directory, stage the deploy directory",
    "$ npm run server .. launch the server in the deploy directory"
];

module.exports = function() {
    console.log(helpLines.join('\n'));
};
