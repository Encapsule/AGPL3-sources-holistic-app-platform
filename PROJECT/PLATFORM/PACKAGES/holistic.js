
// PROJECT/PACKAGES/holistic.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");

const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");
const packageMeta = require("../../../package");

let exportObject = {

    packageType: "tools",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "@encapsule/holistic distribution package contains the Holistic App Platform's consituent runtime libraries, and " +
            " the 'appgen' command-line tool used to create derived JavaScript projects and keep them up-to-date.",
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

        introduction: {
            markdown: [
                "TODO: Briefly explain the contents of the `@encapsule/holistic` distribution package and explain how it relates to the Holistic App Platform."
            ]
        },

        distributionPackage: {

            // Distribution package description comes from the package manifest description string property... (not here)

            prerequisites: {
                markdown: [
                    "To get started you will need the following tools installed and available in your development environment:",

                    [
                        "- [GNU Make](https://www.gnu.org/software/make/)",
                        "- [git](https://git-scm.com/)",
                        `- [Node.js](https://nodejs.org) ${packageMeta.engines.node}`,
                        `- [npm](https://www.npmjs.com) ${packageMeta.engines.npm}`
                    ].join("\n"),

                    [
                        "With these base prerequisites satisfied, you will be able to install the `@encapsule/holistic` distribution package.",
                        "And, then leverage the `appgen` command line utility to create/update your Holistic App Platform application service."
                    ].join("\n"),

                ]
            },
            installation: {
                markdown: [
                    "TODO: Add some notes on installation once the package is published to npm."
                ]
            },
            usage: {
                markdown: [
                    "TODO: Add a brief introduction to how this package is used along with a link to the appgen section of this README."
                ]
            }
        },

        holisticAppPlatform: {
            overview: {
                markdown: [

                    "A **holistic application service** is a developer-maintained Node.js package git repository initialized and subsequently updated with the `appgen` command-line utility.",

                    "All holistic application services maintained with `appgen` have the same basic structure and base-level feature set.",

                    [
                        "- Base-level directory structure and entry module file naming conventions.",
                        "    - Base-level directory structure is prescriptive and required.",
                        "    - Developers can extend the directory / file structure:",
                        "        - Extend existing directory branches.",
                        "        - Create new directory trees rooted in the root directory.",
                        "- The `package.json` in derived holistic application packages is code-generated and owned `appgen`.",
                        "    - After first `appgen` run developers should edit `holistic-app.json` and not the code-generated `package.json`.",
                        "        - `devDependencies` is managed by `appgen` and is developer-extensible via `holistic-app.json`.",
                        "        - `scripts` is managed by `appgen` and is developer-extensible via `holistic-app.json`. Platform-defined scripts include:",
                        "            - build - build the holistic application by calling `make application`.",
                        "            - clean - remove the previous application build.",
                        "            - debug-server - build and start the Node.js HTTP app server on localhost under Node.js inspector.",
                        "            - holodeck - execute your application's @encapsule/holodeck test runner.",
                        "            - iruts - generate a batch of v4 UUID-derived IRUT-format identifier strings.",
                        "            - reset - scrub and additionally clear your local npm cache forcing complete re-stage on `npm install`.",
                        "            - server - build and start the Node.js HTTP app server on localhost.",
                        "            - scrub - clean and additionally delete `node_modules` directory.",
                        "            - start - launch a previously built Node.js HTTP app server on localhost.",
                        "- Core application build is automated by an `appgen`-generated `Makefile`.",
                        "    - Abstracts building a holistic application so that you can launch the Node.js HTTP app server. And, service the bundled client application.",
                        "    - Does not abstract the application-specific details required to:",
                        "        - Test your holistic application.",
                        "        - Package your application for distribution (e.g. further source transformation, Dockerfile generation...).",
                        "        - Deploy your application to a cloud service provider.",
                        "    - Developers can define application-specific test, packaging, and deployment targets in `Makefile-App`.",
                        "    - Holistic application build depends on [eslint], [babel], and [webpack].",
                        "        - Configuration for these tools is imposed by `appgen` and is not currently developer-extensible.",
                    ].join("\n"),


                ]
            },
            appgen: {
                markdown: [

                    "The `appgen` utility is a code generation tool used by developers to initialize and maintain **holistic applications**.",

                    "Both initialization and maintenance operations are performed using the same simple command line:",

                    "```\n$ path_to_holistic/appgen --appRepoDir path_to_your_app_repo\n```",

                    "Here is what happens when you execute `appgen` on your_app_repo:",

                    [
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
                        "- Execute `npm install` to update dependencies per rewritten `package.json`."
                    ].join("\n")

                ]

            }

        }

    }

};


module.exports = exportObject;
