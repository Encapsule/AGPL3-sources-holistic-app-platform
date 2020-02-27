# https://www.gnu.org/software/make/manual/make.html
# https://timmurphy.org/2015/09/27/how-to-get-a-makefile-directory-path/
# https://stackoverflow.com/questions/33126425/how-to-remove-the-last-trailing-backslash-in-gnu-make-file
# $(patsubst %\,%,$(__PATHS_FEATURE))

DIR_ROOT=$(patsubst %/,%,$(dir $(realpath $(firstword $(MAKEFILE_LIST)))))
$(info ***** @encapsule/holistic-master platform make *****)
$(info DIR_ROOT is $(DIR_ROOT))

DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint
TOOL_MOCHA=$(DIR_TOOLBIN)/mocha

DIR_GEN=$(DIR_ROOT)/PROJECT/GENERATOR

DIR_PROJECT=$(DIR_ROOT)/PROJECT
DIR_GENERATOR=$(DIR_PROJECT)/GENERATOR
DIR_PLATFORM=$(DIR_PROJECT)/PLATFORM
DIR_PLATFORM_ASSETS=$(DIR_PLATFORM)/ASSETS

$(info DIR_PROJECT is $(DIR_PROJECT))
$(info DIR_GENERATOR is $(DIR_GENERATOR))
$(info DIR_PLATFORM is $(DIR_PLATFORM))
$(info DIR_PLATFORM_ASSETS is $(DIR_PLATFORM_ASSETS))

TOOL_GEN_REPO_BUILDTAG=$(DIR_PLATFORM)/generate-package-build-manifest.js
TOOL_GEN_PACKAGE_NAMES_MANIFEST=$(DIR_PLATFORM)/export-platform-packages-json.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PLATFORM)/generate-package-manifest.js
TOOL_GEN_PACKAGE_LICENSE=$(DIR_PLATFORM)/generate-package-license.js
TOOL_GEN_PACKAGE_README=$(DIR_PLATFORM)/generate-package-readme.js
TOOL_GEN_FILTER_README=$(DIR_TOOLBIN)/arc_doc_filter

$(info TOOL_GEN_REPO_BUILDTAG is $(TOOL_GEN_REPO_BUILDTAG))

TOOL_BABEL=$(DIR_TOOLBIN)/babel
TOOL_WEBPACK=$(DIR_TOOLBIN)/webpack-cli
TOOL_WEBPACK_FLAGS=--display-modules --verbose --debug --progress --colors --devtool source-map --output-pathinfo

# SOURCES

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_D2R2=$(DIR_SOURCES_LIB)/d2r2
DIR_SOURCES_LIB_D2R2_COMPONENTS=$(DIR_SOURCES_LIB)/d2r2-components
DIR_SOURCES_LIB_HASH_ROUTER=$(DIR_SOURCES_LIB)/hash-router
DIR_SOURCES_LIB_HOLARCHY=$(DIR_SOURCES_LIB)/holarchy
DIR_SOURCES_LIB_HOLARCHY_CM=$(DIR_SOURCES_LIB)/holarchy-cm
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism
DIR_SOURCES_LIB_HOLISM_METADATA=$(DIR_SOURCES_LIB)/holism-metadata
DIR_SOURCES_LIB_HOLISM_SERVICES=$(DIR_SOURCES_LIB)/holism-services
DIR_SOURCES_LIB_HOLISTIC=$(DIR_SOURCES_LIB)/holistic
DIR_SOURCES_LIB_HOLISTIC_APP_CLIENT_CM=$(DIR_SOURCES_LIB)/holistic-app-client-cm
DIR_SOURCES_LIB_HOLISTIC_APP_SERVER_CM=$(DIR_SOURCES_LIB)/holistic-app-server-cm
DIR_SOURCES_LIB_HOLODECK=$(DIR_SOURCES_LIB)/holodeck
DIR_SOURCES_LIB_HOLODECK_ASSETS=$(DIR_SOURCES_LIB)/holodeck-assets
DIR_SOURCES_LIB_HREQUEST=$(DIR_SOURCES_LIB)/hrequest

# BUILD

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_D2R2=$(DIR_BUILD_LIB)/d2r2
DIR_BUILD_LIB_D2R2_COMPONENTS=$(DIR_BUILD_LIB)/d2r2-components
DIR_BUILD_LIB_HASH_ROUTER=$(DIR_BUILD_LIB)/hash-router
DIR_BUILD_LIB_HOLARCHY=$(DIR_BUILD_LIB)/holarchy
DIR_BUILD_LIB_HOLARCHY_CM=$(DIR_BUILD_LIB)/holarchy-cm
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism
DIR_BUILD_LIB_HOLISM_METADATA=$(DIR_BUILD_LIB)/holism-metadata
DIR_BUILD_LIB_HOLISM_SERVICES=$(DIR_BUILD_LIB)/holism-services
DIR_BUILD_LIB_HOLISTIC=$(DIR_BUILD_LIB)/holistic
DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM=$(DIR_BUILD_LIB)/holistic-app-client-cm
DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM=$(DIR_BUILD_LIB)/holistic-app-server-cm
DIR_BUILD_LIB_HOLODECK=$(DIR_BUILD_LIB)/holodeck
DIR_BUILD_LIB_HOLODECK_ASSETS=$(DIR_BUILD_LIB)/holodeck-assets
DIR_BUILD_LIB_HREQUEST=$(DIR_BUILD_LIB)/hrequest

DIR_DISTS=$(DIR_ROOT)/DISTS
DIR_DIST_PKG_HOLISTIC=$(DIR_DISTS)/holistic
DIR_DIST_PKG_HOLISTIC_PACKAGES=$(DIR_DIST_PKG_HOLISTIC)/PACKAGES
DIR_DIST_PKG_HOLISTIC_PROJECT=$(DIR_DIST_PKG_HOLISTIC)/PROJECT

DIR_DIST_PKG_HOLARCHY=$(DIR_DISTS)/holarchy
DIR_DIST_LIB_HOLARCHY=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holarchy

DIR_DIST_PKG_HOLARCHY_CM=$(DIR_DISTS)/holarchy-cm
DIR_DIST_LIB_HOLARCHY_CM=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holarchy-cm

DIR_DIST_PKG_HOLISTIC_APP_CLIENT_CM=$(DIR_DISTS)/holistic-app-client-cm
DIR_DIST_LIB_HOLISTIC_APP_CLIENT_CM=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holistic-app-client-cm

DIR_DIST_PKG_HOLISTIC_APP_SERVER_CM=$(DIR_DISTS)/holistic-app-server-cm
DIR_DIST_LIB_HOLISTIC_APP_SERVER_CM=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holistic-app-server-cm

DIR_DIST_PKG_HOLISM=$(DIR_DISTS)/holism
DIR_DIST_LIB_HOLISM=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holism

DIR_DIST_PKG_HOLISM_METADATA=$(DIR_DISTS)/holism-metadata
DIR_DIST_LIB_HOLISM_METADATA=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holism-metadata

DIR_DIST_PKG_HOLISM_SERVICES=$(DIR_DISTS)/holism-services
DIR_DIST_LIB_HOLISM_SERVICES=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holism-services

DIR_DIST_PKG_HREQUEST=$(DIR_DISTS)/hrequest
DIR_DIST_LIB_HREQUEST=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/hrequest

DIR_DIST_PKG_D2R2=$(DIR_DISTS)/d2r2
DIR_DIST_LIB_D2R2=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/d2r2

DIR_DIST_PKG_D2R2_COMPONENTS=$(DIR_DISTS)/d2r2-components
DIR_DIST_LIB_D2R2_COMPONENTS=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/d2r2-components

DIR_DIST_PKG_HASH_ROUTER=$(DIR_DISTS)/hash-router
DIR_DIST_LIB_HASH_ROUTER=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/hash-router

DIR_DIST_PKG_HOLODECK=$(DIR_DISTS)/holodeck
DIR_DIST_LIB_HOLODECK=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holodeck

DIR_DIST_PKG_HOLODECK_ASSETS=$(DIR_DISTS)/holodeck-assets
DIR_DIST_LIB_HOLODECK_ASSETS=$(DIR_DIST_PKG_HOLISTIC_PACKAGES)/holodeck-assets

DIR_PLATFORM_RTL_PACKAGES=$(DIR_ROOT)/PACKAGES

default:
	@echo This Makefile is used to build, test, and publish new versions of
	@echo the holistic web application framework.
	@echo
	@echo Please specify Makefile target\(s\) to evaluate as arguments to \'make\'.
	@echo Type \'make\' and use shell auto-complete to enumerate Makefile targets.
	@echo See this repo\'s README.md file for further details and instructions.

# ================================================================
# Environment

env_initialize:
	@echo env_initialize target starting...
	yarn install --verbose
	@echo env_initialize target complete.

env_reinitialize: env_clean_cache env_initialize
	@echo Your local yarn cache has been repopulated with fresh packages from the Internet. And the contents of $(DIR_MODULES) has been rewritten.

env_clean:
	@echo env_clean target starting...
	echo rm -rf $(DIR_MODULES)
	@echo env_clean target complete.

env_clean_cache: env_clean
	@echo env_reset target starting...
	yarn cache clean
	@echo env_reset target complete.

env_generate_build_tag:
	@echo generate_build_tag target starting..
	$(info TOOL_GEN_REPO_BUILDTAG is $(TOOL_GEN_REPO_BUILDTAG))
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/holistic.json
	$(TOOL_GEN_PACKAGE_NAMES_MANIFEST) > $(DIR_BUILD)/holistic-rtl-packages.json
	@echo generate_build_tag target complete.

# ================================================================
# Source Package Targets

source_packages_clean:
	@echo source_packages_clean target starting...
	rm -rf $(DIR_BUILD)/*
	@echo source_packages_clean target complete.

source_packages_build: env_initialize env_generate_build_tag source_package_build_hash_router source_package_build_holism source_package_build_holism_metadata source_package_build_holism_services source_package_build_hrequest source_package_build_holarchy source_package_build_holarchy_cm source_package_build_d2r2 source_package_build_d2r2_components source_package_build_holodeck source_package_build_holodeck_assets source_package_build_holistic source_package_build_holistic_app_client_cm source_package_build_holistic_app_server_cm
	rm -fv `find $(DIR_BUILD) | grep '~'`
	@echo source_packages_build complete.

source_package_build_hash_router:
	@echo source_package_build_hash_router target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HASH_ROUTER)/
	mkdir -p $(DIR_BUILD_LIB_HASH_ROUTER)

	mkdir -p $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HASH_ROUTER)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HASH_ROUTER)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HASH_ROUTER)/* $(DIR_BUILD_LIB_HASH_ROUTER)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/hash-router" > $(DIR_BUILD_LIB_HASH_ROUTER)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HASH_ROUTER)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HASH_ROUTER)

source_package_build_holism:
	@echo source_package_build_holism target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM)
	mkdir -p $(DIR_BUILD_LIB_HOLISM)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLISM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLISM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLISM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLISM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLISM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLISM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISM)/* $(DIR_BUILD_LIB_HOLISM)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holism" > $(DIR_BUILD_LIB_HOLISM)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM)
	mkdir -p $(DIR_BUILD_LIB_HOLISM)/docs
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-server-filter-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/server-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-service-filter-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-integration-filters-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/integrations-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-response-write-filter.js --output $(DIR_BUILD_LIB_HOLISM)/docs/server-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-response-serialize-filter.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-result-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-response-error-filter.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-error-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/service-data-gateway.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-data-gateway.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/data-gateway-router-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/data-gateway-router-filter.md
	@echo source_package_build_holism target complete.

source_package_build_holism_services:
	@echo source_package_build_holism_services target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM_SERVICES)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM_SERVICES)
	mkdir -p $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLISM_SERVICES)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM_SERVICES)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISM_SERVICES)/* $(DIR_BUILD_LIB_HOLISM_SERVICES)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holism-services" > $(DIR_BUILD_LIB_HOLISM_SERVICES)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM_SERVICES)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM_SERVICES)
	# ISSUE HERE IS THAT WE DON'T HAVE @encapsule/holism PACKAGE INSTALLED SO THE MODULE LOAD FAILS.
	#	mkdir -p $(DIR_BUILD_LIB_HOLISM_SERVICES)/docs
	#	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_SERVICES)/service-developer-get-app-data-store-filter-spec.js --output $(DIR_BUILD_LIB_HOLISM_SERVICES)/doc/service-developer-get-app-data-store-filter-spec.md
	#	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_SERVICES)/service-developer-get-app-data-store-integrations.js --output $(DIR_BUILD_LIB_HOLISM_SERVICES)/doc/service-developer-get-app-data-store-integrations.md
	#	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_SERVICES)/service-fs-markdown-render.js --output $(DIR_BUILD_LIB_HOLISM_SERVICES)/doc/service-fs-markdown-render.md
	#	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_SERVICES)/service-health-check.js --output $(DIR_BUILD_LIB_HOLISM_SERVICES)/doc/service-health-check.md
	#	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_SERVICES)/service-options-as-html-content.js --output $(DIR_BUILD_LIB_HOLISM_SERVICES)/doc/service-options-as-html-content.md
	@echo source_package_build_holism_services target complete.

source_package_build_holism_metadata:
	@echo source_package_build_holism_metadata target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM_METADATA)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM_METADATA)
	mkdir -p $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLISM_METADATA)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM_METADATA)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISM_METADATA)/* $(DIR_BUILD_LIB_HOLISM_METADATA)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holism-metadata" > $(DIR_BUILD_LIB_HOLISM_METADATA)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM_METADATA)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM_METADATA)

source_package_build_hrequest:
	@echo source_package_build_hrequest...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HREQUEST)/
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HREQUEST)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HREQUEST)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HREQUEST)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HREQUEST)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HREQUEST)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HREQUEST)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HREQUEST)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HREQUEST)/* $(DIR_BUILD_LIB_HREQUEST)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/hrequest" > $(DIR_BUILD_LIB_HREQUEST)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HREQUEST)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HREQUEST)
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)/docs
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/server-factory.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/server-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/client-factory.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/client-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/lib/http-request-filter-factory.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/request-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/lib/http-request-transport-for-node.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/server-request-transport.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/lib/http-request-transport-for-browser.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/client-request-transport.md
	@echo source_package_build_hrequest complete.

source_package_build_holarchy:
	@echo source_package_build_holarchy...
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY)
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLARCHY)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLARCHY)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLARCHY)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLARCHY)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLARCHY)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLARCHY)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLARCHY)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLARCHY)/* $(DIR_BUILD_LIB_HOLARCHY)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLARCHY) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLARCHY)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holarchy" > $(DIR_BUILD_LIB_HOLARCHY)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLARCHY)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLARCHY)
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY)/docs
	@echo source_package_build_holarchy complete.

source_package_build_holarchy_cm:
	@echo source_package_build_holarchy_cm...
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY_CM)
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLARCHY_CM)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLARCHY_CM)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLARCHY_CM)/* $(DIR_BUILD_LIB_HOLARCHY_CM)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLARCHY_CM) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLARCHY_CM)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holarchy-cm" > $(DIR_BUILD_LIB_HOLARCHY_CM)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLARCHY_CM)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLARCHY_CM)
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY_CM)/docs
	@echo source_package_build_holarchy_cm complete.

source_package_build_holistic_app_client_cm:
	@echo source_package_build_holistic_app_client_cm...
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISTIC_APP_CLIENT_CM)/* $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLISTIC_APP_CLIENT_CM)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holistic-app-client-cm" > $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM)/docs
	@echo source_package_build_holistic_app_client_cm complete.

source_package_build_holistic_app_server_cm:
	@echo source_package_build_holistic_app_server_cm...
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISTIC_APP_SERVER_CM)/* $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLISTIC_APP_SERVER_CM)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holistic-app-server-cm" > $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM)/docs
	@echo source_package_build_holistic_app_server_cm complete.

source_package_build_holodeck:
	@echo source_package_build_holodeck...
	mkdir -p $(DIR_BUILD_LIB_HOLODECK)
	mkdir -p $(DIR_BUILD_LIB_HOLODECK)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLODECK)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLODECK)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLODECK)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLODECK)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLODECK)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLODECK)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLODECK)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLODECK)/* $(DIR_BUILD_LIB_HOLODECK)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLODECK) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLODECK)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holodeck" > $(DIR_BUILD_LIB_HOLODECK)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLODECK)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLODECK)
	mkdir -p $(DIR_BUILD_LIB_HOLODECK)/docs
	@echo source_package_build_holodeck complete.

source_package_build_holodeck_assets:
	@echo source_package_build_holodeck_assets...
	mkdir -p $(DIR_BUILD_LIB_HOLODECK_ASSETS)
	mkdir -p $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLODECK_ASSETS)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLODECK_ASSETS)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLODECK_ASSETS)/* $(DIR_BUILD_LIB_HOLODECK_ASSETS)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLODECK_ASSETS) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLODECK_ASSETS)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holodeck-assets" > $(DIR_BUILD_LIB_HOLODECK_ASSETS)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLODECK_ASSETS)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLODECK_ASSETS)
	mkdir -p $(DIR_BUILD_LIB_HOLODECK_ASSETS)/docs
	@echo source_package_build_holodeck_assets complete.


source_package_build_d2r2:
	@echo source_package_build_d2r2...
	mkdir -p $(DIR_BUILD_LIB_D2R2)
	mkdir -p $(DIR_BUILD_LIB_D2R2)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_D2R2)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_D2R2)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_D2R2)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_D2R2)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_D2R2)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_D2R2)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_D2R2)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_D2R2)/* $(DIR_BUILD_LIB_D2R2)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_D2R2) --keep-file-extension --verbose $(DIR_SOURCES_LIB_D2R2)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/d2r2" > $(DIR_BUILD_LIB_D2R2)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_D2R2)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_D2R2)
	mkdir -p $(DIR_BUILD_LIB_D2R2)/docs
	@echo source_package_build_d2r2 complete.

source_package_build_d2r2_components:
	@echo source_package_build_d2r2_components...
	mkdir -p $(DIR_BUILD_LIB_D2R2_COMPONENTS)
	mkdir -p $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_D2R2_COMPONENTS)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_D2R2_COMPONENTS)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_D2R2_COMPONENTS)/* $(DIR_BUILD_LIB_D2R2_COMPONENTS)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_D2R2_COMPONENTS) --keep-file-extension --verbose $(DIR_SOURCES_LIB_D2R2_COMPONENTS)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/d2r2-components" > $(DIR_BUILD_LIB_D2R2_COMPONENTS)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_D2R2_COMPONENTS)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_D2R2_COMPONENTS)
	#	mkdir -p $(DIR_BUILD_LIB_D2R2_COMPONENTS)/docs
	@echo source_package_build_d2r2 complete.

source_package_build_holistic:
	@echo source_package_build_holistic start
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC)
	mkdir -p $(DIR_BUILD_LIB_HOLISTIC)/ASSETS
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-16x16.png $(DIR_BUILD_LIB_HOLISTIC)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/blue-burst-encapsule.io-icon-72x72.png $(DIR_BUILD_LIB_HOLISTIC)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-16x16.png $(DIR_BUILD_LIB_HOLISTIC)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-24x24.png $(DIR_BUILD_LIB_HOLISTIC)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-32x32.png $(DIR_BUILD_LIB_HOLISTIC)/ASSETS/
	cp -p $(DIR_PLATFORM_ASSETS)/images/encapsule-holistic-48x48.png $(DIR_BUILD_LIB_HOLISTIC)/ASSETS/

	cp -p $(DIR_PLATFORM_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISTIC)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISTIC)/* $(DIR_BUILD_LIB_HOLISTIC)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLISTIC) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLISTIC)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holistic" > $(DIR_BUILD_LIB_HOLISTIC)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISTIC)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISTIC)

	#	mkdir -p $(DIR_BUILD_LIB_D2R2_COMPONENTS)/docs

	@echo source_package_build_holistic finish


# ================================================================
# Distribution Packages
#

# OPTIONAL: remove generated packages and clone distribution package repositories.
# Subsequently, evaluating the packages_update Makefile target will update the contents
# of the distribution repo which is typically then commited and published.
dist_packages_initialize: dist_packages_reset
	@echo BEGIN TARGET: dist_packages_initialize
	git clone git@github.com:Encapsule/holistic.git $(DIR_DIST_PKG_HOLISTIC)
	@echo FINISH TARGET: dist_packages_initialize

# OPTIONAL: check the status of the package distribution repositories.
dist_packages_status:
	@echo BEGIN TARGET: dist_packages_status

	@echo ================================================================
	cd $(DIR_DIST_PKG_HOLISTIC) && git remote -v && git status

	@echo ================================================================
	@echo FINISH TARGET: dist_packages_status

dist_packages_clean:
	@echo BEGIN TARGET: dist_packages_clean
	rm -rf $(DIR_DIST_PKG_D2R2) $(DIR_DIST_PKG_D2R2_COMPONENTS) $(DIR_DIST_PKG_HASH_ROUTER) $(DIR_DIST_PKG_HOLARCHY) $(DIR_DIST_PKG_HOLARCHY_CM) $(DIR_DIST_PKG_HOLISM) $(DIR_DIST_PKG_HOLISM_METADATA) $(DIR_DIST_PKG_HOLISM_SERVICES) $(DIR_DIST_PKG_HOLISTIC)/* $(DIR_DIST_PKG_HOLISTIC_APP_CLIENT_CM) $(DIR_DIST_PKG_HOLISTIC_APP_SERVER_CM) $(DIR_DIST_PKG_HOLODECK) $(DIR_DIST_PKG_HOLODECK_ASSETS) $(DIR_DIST_PKG_HREQUEST) $(DIR_DISTS)/*.json
	@echo COMPLETE TARGET: dist_packages_clean

dist_packages_reset:
	@echo BEGIN TARGET: dist_packages_reset
	rm -rf $(DIR_DISTS)/*
	@echo FINISH TARGET: dist_packages_reset

dist_packages_update: source_packages_build dist_package_update_holarchy dist_package_update_holarchy_cm dist_package_update_holism dist_package_update_holism_services dist_package_update_hrequest dist_package_update_d2r2 dist_package_update_d2r2_components dist_package_update_holism_metadata dist_package_update_hash_router dist_package_update_holodeck  dist_package_update_holodeck_assets dist_package_update_holistic dist_package_update_holistic_app_client_cm dist_package_update_holistic_app_server_cm
	@echo BEGIN TARGET: dist_packages_update
	cp -p $(DIR_BUILD)/holistic.json $(DIR_DISTS)
	cp -p $(DIR_BUILD)/holistic-rtl-packages.json $(DIR_DISTS)
	@echo FINISH TARGET: dist_packages_update

dist_package_update_hash_router:
	@echo BEGIN TARGET: dist_package_update_hash_router
	mkdir -p $(DIR_DIST_PKG_HASH_ROUTER)
	mkdir -p $(DIR_DIST_LIB_HASH_ROUTER)
	cp -Rp $(DIR_BUILD_LIB_HASH_ROUTER) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HASH_ROUTER) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_hash_router

dist_package_update_holarchy:
	@echo BEGIN TARGET: dist_package_update_holarchy
	mkdir -p $(DIR_DIST_PKG_HOLARCHY)
	mkdir -p $(DIR_DIST_LIB_HOLARCHY)
	cp -Rp $(DIR_BUILD_LIB_HOLARCHY) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLARCHY) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holarchy

dist_package_update_holarchy_cm:
	@echo BEGIN TARGET: dist_package_update_holarchy_cm
	mkdir -p $(DIR_DIST_PKG_HOLARCHY_CM)
	mkdir -p $(DIR_DIST_LIB_HOLARCHY_CM)
	cp -Rp $(DIR_BUILD_LIB_HOLARCHY_CM) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLARCHY_CM) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holarchy_cm


dist_package_update_holistic_app_client_cm:
	@echo BEGIN TARGET: dist_package_update_holistic_app_client_cm
	mkdir -p $(DIR_DIST_PKG_HOLISTIC_APP_CLIENT_CM)
	mkdir -p $(DIR_DIST_LIB_HOLISTIC_APP_CLIENT_CM)
	cp -Rp $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLISTIC_APP_CLIENT_CM) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holistic_app_client_cm

dist_package_update_holistic_app_server_cm:
	@echo BEGIN TARGET: dist_package_update_holistic_app_server_cm
	mkdir -p $(DIR_DIST_PKG_HOLISTIC_APP_SERVER_CM)
	mkdir -p $(DIR_DIST_LIB_HOLISTIC_APP_SERVER_CM)
	cp -Rp $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLISTIC_APP_SERVER_CM) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holistic_app_server_cm

dist_package_update_holism:
	@echo BEGIN TARGET: dist_package_update_holism
	mkdir -p $(DIR_DIST_PKG_HOLISM)
	mkdir -p $(DIR_DIST_LIB_HOLISM)
	cp -Rp $(DIR_BUILD_LIB_HOLISM) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLISM) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holism

dist_package_update_holism_services:
	@echo BEGIN TARGET: dist_package_update_holism_services
	mkdir -p $(DIR_DIST_PKG_HOLISM_SERVICES)
	mkdir -p $(DIR_DIST_LIB_HOLISM_SERVICES)
	cp -Rp $(DIR_BUILD_LIB_HOLISM_SERVICES) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLISM_SERVICES) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holism_services

dist_package_update_holism_metadata:
	@echo BEGIN TARGET: dist_package_update_holism_metadata
	mkdir -p $(DIR_DIST_PKG_HOLISM_METADATA)
	mkdir -p $(DIR_DIST_LIB_HOLISM_METADATA)
	cp -Rp $(DIR_BUILD_LIB_HOLISM_METADATA) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLISM_METADATA) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holism_metadata

dist_package_update_holodeck:
	@echo BEGIN TARGET: dist_package_update_holodeck
	mkdir -p $(DIR_DIST_PKG_HOLODECK)
	mkdir -p $(DIR_DIST_LIB_HOLODECK)
	cp -Rp $(DIR_BUILD_LIB_HOLODECK) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLODECK) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holodeck

dist_package_update_holodeck_assets:
	@echo BEGIN TARGET: dist_package_update_holodeck_assets
	mkdir -p $(DIR_DIST_PKG_HOLODECK_ASSETS)
	mkdir -p $(DIR_DIST_LIB_HOLODECK_ASSETS)
	cp -Rp $(DIR_BUILD_LIB_HOLODECK_ASSETS) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HOLODECK_ASSETS) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_holodeck_assets

dist_package_update_hrequest:
	@echo BEGIN TARGET: dist_package_update_hrequest
	mkdir -p $(DIR_DIST_PKG_HREQUEST)
	mkdir -p $(DIR_DIST_LIB_HREQUEST)
	cp -Rp $(DIR_BUILD_LIB_HREQUEST) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_HREQUEST) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_hrequest

dist_package_update_d2r2:
	@echo BEGIN TARGET: dist_package_update_d2r2
	mkdir -p $(DIR_DIST_PKG_D2R2)
	mkdir -p $(DIR_DIST_LIB_D2R2)
	cp -Rp $(DIR_BUILD_LIB_D2R2) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_D2R2) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_hrequest

dist_package_update_d2r2_components:
	@echo BEGIN TARGET: dist_package_update_d2r2_components
	mkdir -p $(DIR_DIST_PKG_D2R2_COMPONENTS)
	mkdir -p $(DIR_DIST_LIB_D2R2_COMPONENTS)
	cp -Rp $(DIR_BUILD_LIB_D2R2_COMPONENTS) $(DIR_DISTS)
	cp -Rp $(DIR_BUILD_LIB_D2R2_COMPONENTS) $(DIR_DIST_PKG_HOLISTIC_PACKAGES)
	@echo END TARGET: dist_package_update_d2r2_components

dist_package_update_holistic:
	@echo BEGIN TARGET: dist_package_update_holistic
	mkdir -p $(DIR_DIST_PKG_HOLISTIC)
	cp -Rp $(DIR_BUILD_LIB_HOLISTIC) $(DIR_DISTS)
	mkdir -p $(DIR_DIST_PKG_HOLISTIC_PROJECT)
	cp -Rp $(DIR_GEN) $(DIR_DIST_PKG_HOLISTIC_PROJECT)/
	cp -p $(DIR_BUILD)/holistic.json $(DIR_DIST_PKG_HOLISTIC_PACKAGES)/
	cp -p $(DIR_BUILD)/holistic-rtl-packages.json $(DIR_DIST_PKG_HOLISTIC_PACKAGES)/
	@echo END TARGET: dist_package_update_holistic


# ================================================================
# Holistic platform runtime distribution packages.

platform_clean:
	@echo BEGIN TARGET: platform_clean
	rm -rf $(DIR_PLATFORM_RTL_PACKAGES)/*
	@echo FINISH TARGET: platform_clean

platform_update: source_packages_clean dist_packages_clean dist_packages_update
	@echo BEGIN TARGET: platform_update
	mkdir -p $(DIR_PLATFORM_RTL_PACKAGES)

	cp -Rp $(DIR_DISTS)/* $(DIR_PLATFORM_RTL_PACKAGES)
	rm -rf $(DIR_PLATFORM_RTL_PACKAGES)/holistic/.git

	$(DIR_ROOT)/TESTS/run-tests.js
	@echo FINISH TARGET: platform_update

# ================================================================
# Utility
#

clean: source_packages_clean
	@echo Clean operation complete.

scrub: clean dist_packages_clean platform_clean
	@echo Scrub operation complete.

scrubdate: scrub platform_update
	@echo Scrubbed platform update complete. Staged platform RTL git diffs should be checked prior to commit.

reset: scrub env_clean_cache
	@echo Reset operation complete.

test:
	$(DIR_ROOT)/TESTS/run-tests.js

test-debug:
	node --inspect-brk TESTS/run-tests.js

iruts:
	$(DIR_TOOLBIN)/arc_generateIRUT


