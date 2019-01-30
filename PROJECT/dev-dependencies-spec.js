module.exports = {
    ____label: "Development Dependencies",
    ____description: "A map of development dependency package names to semantic version strings that are required by the Encapsule/holistic " +
	"framework's build, packaging, test, and runtime infrastructure platform.",
    ____types: "jsObject",
    ____asMap: true,
    ____defaultValue: {},
    packageName: {
	____label: "Package Dependency Version",
	____description: "The semantic version string or git repo specification of the source of the dependency package.",
	____accept: "jsString"
    }
};

