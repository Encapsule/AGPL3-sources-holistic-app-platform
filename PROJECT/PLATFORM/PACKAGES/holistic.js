
// PROJECT/PACKAGES/holistic.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");

const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");
const packageMeta = require("../../../package");

let exportObject = {

    packageType: "tools",
    packageEnvironment: [ "node" ],
    packageManifestOverrides: {
        description: "Full-stack component engineering platform for building complex stateful webs apps and services with software models.",
        keywords: [ "encapsule", "holistic" ],
        license: "MIT",
        main: "index.js",
        devDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/arctools": arccore.__meta.version,
            "mkdirp": packageMeta.devDependencies["mkdirp"],
            "semver": packageMeta.devDependencies["semver"]
        },
        bin: {
            appgen: "./appgen"
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
                "### Welcome the the Holistic App Platform",

                "Holistic app platform is a collection of modular JavaScript runtime libraries (RTL) used to build full-stack client/server applications from plug-and-play software models.",
                "Work on is project is quite active right now as it's being used to re-design and re-implement an existing commercial SaaS product.",

                "**PRE-RELEASE STATUS**",
                "Holistic app platform is becoming quite stable. But, lacks examples (required) and API documentation (required). Unless you're one of a small handful of insane people (thank you insane people!) who are working with this codebase every day then you probably should just make a bookmark and come back later... This project is an insane amount of work...",

                // THIS HAS TO COME LAST IN THE OVERVIEW!
                "### Contents",
                "- [**appgen**](#appgen-utility) - A command-line utility used to initialize & maintain derived app/service git repos.",
                "- [**Holistic Platform Runtime**](#holistic-platform-runtime \"Jump to RTL package index...\") - Core runtime app/service runtime libraries (RTL) packages."
            ]
        },

        holisticAppSections: [
            {
                markdown: [
                    "## Holistic Applications",

                    "A **holistic application** is a developer-maintained Node.js package git repository initialized and subsequently updated with the `appgen` command-line utility.",

                    "All holistic applications maintained with `appgen` have the same basic structure and base-level feature set:",

                    "- Base-level directory structure and entry module file naming conventions.",
                    "    - Base-level directory structure is prescriptive and required.",
                    "    - Developers can extend the directory / fire structure:",
                    "        - Extend existing branches.",
                    "        - Create new directory trees rooted in the root directory.",

                    "- The `package.json` in derived holistic application packages is code-generated and owned `appgen`.",
                    "    - At inception there is only `package.json`.",
                    "    - After first `appgen` run developers should edit `holistic-app.json`.",
                    "    - `devDependencies` is managed by `appgen` and is developer-extensible via `holistic-app.json`.",
                    "    - `scripts` is managed by `appgen` and is developer-extensible via `holistic-app.json`. Platform-defined scripts include:",
                    "        - build - build the holistic application by calling `make application`.",
                    "        - clean - remove the previous application build.",
                    "        - debug-server - build and start the Node.js HTTP app server on localhost under Node.js inspector.",
                    "        - holodeck - execute your application's @encapsule/holodeck test runner.",
                    "        - iruts - generate a batch of v4 UUID-derived IRUT-format identifier strings.",
                    "        - reset - scrub and additionally clear your local npm cache forcing complete re-stage on `npm install`.",
                    "        - server - build and start the Node.js HTTP app server on localhost.",
                    "        - scrub - clean and additionally delete `node_modules` directory.",
                    "        - start - launch a previously built Node.js HTTP app server on localhost.",

                    "- Core application build is automated by an `appgen`-generated `Makefile`.",
                    "    - Abstracts building a holistic application so that you can launch the Node.js HTTP app server. And, service the bundled client application.",
                    "    - Does not abstract the application-specific details required to:",
                    "        - Test your holistic application.",
                    "        - Package your application for distribution (e.g. further source transformation, Dockerfile generation...).",
                    "        - Deploy your application to a cloud service provider.",
                    "    - Developers can define application-specific test, packaging, and deployment targets in `Makefile-App`.",
                    "    - Holistic application build depends on [eslint], [babel], and [webpack].",
                    "        - Configuration for these tools is imposed by `appgen` and is not currently developer-extensible.",

                ]
            }
        ],

        appgenSections: [
            {
                heading: "### Overview",
                markdown: [

                    "The `appgen` utility is a code generation tool used by developers to initialize and maintain **holistic applications**.",

                    "Both initialization and maintenance operations are performed using the same simple command line:",

                    "```\n$ path_to_holistic/appgen --appRepoDir path_to_your_app_repo\n```",

                    "Here is what happens when you execute `appgen` on your_app_repo:",

                    "- Reads or creates a default `holistic-app.json` file.",
                    "- Read your project's `package.json`.",
                    "- Remove previously installed platform runtime libraries (RTL's).",
                    "- Install new platform RTL's.",
                    "- Register platform RTL dependencies.",
                    "- Merge application and platform-defined package dependencies.",
                    "- De-duplicate and error check finalized dependencies.",
                    "- Merge platform-defined npm integrations (e.g. run targets) with app-specific integrations.",
                    "- Merge changes back into `package.json`.",
                    "- Rewrite derived app's `package.json`.",
                    "- Initialize or recreate core project directory structure.",
                    "- Synthesize core GNU Makefile and Makefile-App files.",
                    "- Synthesize tool configuration files required by Makefile targets.",
                    "- Execute `npm install --force --check-files`.",


                ]
            },
            {
                heading: "### Usage",
                markdown: [
                    "#### Prerequisites",

                    "#### Initial Project Setup",

                    "- Create a directory for your new holistic application.",
                    "- Turn your directory into a git repository with `git init`.",
                    "- Turn your git repo into a Node.js package with `npm init`.",
                    "- Commit your empty application package with `git commit -a`.",

                    "#### Project Update",
                    "TODO",

                    "#### Update Verification",
                    "TODO",

                    "#### Update Commit",
                    "TODO",
                ]
            },
            {
                heading: "### Derived Projects",
                markdown: [
                    "Some introductory text.",

                    "#### npm Integrations",
                    "TODO",

                    "#### Project Directory Structure",
                    "TODO", // go back to early vp5 README and steal the overview text I wrote for that

                    "#### Holistic App Build: Makefile",
                    "TODO",

                    "#### App-Specific Build: Makefile-App",
                    "TODO"

                ]
            }
        ]
    }
};


module.exports = exportObject;
