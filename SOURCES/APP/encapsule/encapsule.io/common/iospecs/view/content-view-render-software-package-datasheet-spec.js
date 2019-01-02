// content-view-render-software-package-datasheet-spec.js

module.exports = {
    ____types: "jsObject",
    "holisticView_SoftwarePackage":  {
        ____label: "Software Package Descriptor Render Request",
        ____description: "Contains information describing a software package in sufficient detail to generate human-readable documentation.",
        ____types: "jsObject",
        packageDetails: {
            ____label: "Package Details",
            ____description: "Information about this specific software package.",
            ____types: "jsObject",
            distributionName: {
                ____label: "npm Package Name",
                ____description: "The lowercase name given the package on npm.",
                ____accept: "jsString"
            },
            distributionURL: {
                ____label: "npm URL",
                ____description: "The URL of the package distribution page on npm.",
                ____accept: "jsString"
            },
            distributionLicense: {
                ____label: "Package Distribution License",
                ____description: "The license under which the package is distributed on npm.",
                ____types: "jsObject",
                name: {
                    ____label: "License Name",
                    ____description: "The name of the license.",
                    ____accept: "jsString"
                },
                url: {
                    ____label: "License URL",
                    ____description: "URL of the standard OSS license.",
                    ____accept: "jsString"
                }
            },
            sourceRepositoryName: {
                ____label: "Source Repo Name",
                ____description: "The URI of the source code repository (e.g. ARC_master)",
                ____accept: "jsString"
            },
            sourceRepository: {
                ____label: "Source Code Repo",
                ____description: "Information about the git repo where this package's sources are maintained.",
                ____accept: "jsString"
            },
            sourceLicense: {
                ____label: "Source Code License",
                ____description: "The license under which the package is distributed on npm.",
                ____types: "jsObject",
                name: {
                    ____label: "License Name",
                    ____description: "The name of the license.",
                    ____accept: "jsString"
                },
                url: {
                    ____label: "License URL",
                    ____description: "URL of the standard OSS license.",
                    ____accept: "jsString"
                }
            },
            sourceNotes: {
                ____label: "Notes About Source Code",
                ____description: "Optional information about access to source code and test suites.",
                ____types: [ "jsString", "jsNull" ],
                ____defaultValue: null
            }
        },
        introMarkdownSource: {
            ____label: "Introduction Markdown Content",
            ____description: "Markdown-format introduction for this software package.",
            ____types: "jsArray",
            ____defaultValue: [
                "## Under Construction",
                "This section is under development and should be available shortly..."
            ],
            markdown: {
                ____label: "Markdown Content Line",
                ____description: "A single line of markdown content.",
                ____accept: "jsString",

            }
        }
    }
};


