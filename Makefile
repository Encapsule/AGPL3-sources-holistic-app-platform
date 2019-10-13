# https://www.gnu.org/software/make/manual/make.html
# https://timmurphy.org/2015/09/27/how-to-get-a-makefile-directory-path/
# https://stackoverflow.com/questions/33126425/how-to-remove-the-last-trailing-backslash-in-gnu-make-file
# $(patsubst %\,%,$(__PATHS_FEATURE))

DIR_ROOT=$(patsubst %/,%,$(dir $(realpath $(firstword $(MAKEFILE_LIST)))))
$(info ***** @encapsule/holistic platform make *****)
$(info DIR_ROOT is $(DIR_ROOT))

DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint

DIR_PROJECT=$(DIR_ROOT)/PROJECT/PLATFORM
DIR_PROJECT_ASSETS=$(DIR_PROJECT)/ASSETS

TOOL_GEN_REPO_BUILDTAG=$(DIR_PROJECT)/generate-package-build-manifest.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PROJECT)/generate-package-manifest.js
TOOL_GEN_PACKAGE_LICENSE=$(DIR_PROJECT)/generate-package-license.js
TOOL_GEN_PACKAGE_README=$(DIR_PROJECT)/generate-package-readme.js
TOOL_GEN_FILTER_README=$(DIR_TOOLBIN)/arc_doc_filter

TOOL_BABEL=$(DIR_TOOLBIN)/babel
TOOL_WEBPACK=$(DIR_TOOLBIN)/webpack-cli
TOOL_WEBPACK_FLAGS=--display-modules --verbose --debug --progress --colors --devtool source-map --output-pathinfo

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLARCHY=$(DIR_SOURCES_LIB)/holarchy
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism
DIR_SOURCES_LIB_HOLISM_METADATA=$(DIR_SOURCES_LIB)/holism-metadata
DIR_SOURCES_LIB_HOLISM_SERVICES=$(DIR_SOURCES_LIB)/holism-services
DIR_SOURCES_LIB_HREQUEST=$(DIR_SOURCES_LIB)/hrequest
DIR_SOURCES_LIB_D2R2=$(DIR_SOURCES_LIB)/d2r2
DIR_SOURCES_LIB_D2R2_COMPONENTS=$(DIR_SOURCES_LIB)/d2r2-components
DIR_SOURCES_LIB_HASH_ROUTER=$(DIR_SOURCES_LIB)/hash-router

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_HOLARCHY=$(DIR_BUILD_LIB)/holarchy
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism
DIR_BUILD_LIB_HOLISM_METADATA=$(DIR_BUILD_LIB)/holism-metadata
DIR_BUILD_LIB_HOLISM_SERVICES=$(DIR_BUILD_LIB)/holism-services
DIR_BUILD_LIB_HREQUEST=$(DIR_BUILD_LIB)/hrequest
DIR_BUILD_LIB_D2R2=$(DIR_BUILD_LIB)/d2r2
DIR_BUILD_LIB_D2R2_COMPONENTS=$(DIR_BUILD_LIB)/d2r2-components
DIR_BUILD_LIB_HASH_ROUTER=$(DIR_BUILD_LIB)/hash-router

DIR_DISTS=$(DIR_ROOT)/DISTS
DIR_DISTS_LIB=$(DIR_DISTS)/LIB
DIR_DIST_LIB_HOLARCHY=$(DIR_DISTS_LIB)/holarchy
DIR_DIST_LIB_HOLISM=$(DIR_DISTS_LIB)/holism
DIR_DIST_LIB_HOLISM_METADATA=$(DIR_DISTS_LIB)/holism-metadata
DIR_DIST_LIB_HOLISM_SERVICES=$(DIR_DISTS_LIB)/holism-services
DIR_DIST_LIB_HREQUEST=$(DIR_DISTS_LIB)/hrequest
DIR_DIST_LIB_D2R2=$(DIR_DISTS_LIB)/d2r2
DIR_DIST_LIB_D2R2_COMPONENTS=$(DIR_DISTS_LIB)/d2r2-components
DIR_DIST_LIB_HASH_ROUTER=$(DIR_DISTS_LIB)/hash-router

DIR_PLATFORM=$(DIR_ROOT)/PLATFORM

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
	@echo generate_build_tag target starting...
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/holistic.json
	@echo generate_build_tag target complete.

# ================================================================
# Source Package Targets

source_packages_clean:
	@echo source_packages_clean target starting...
	rm -rf $(DIR_BUILD)/*
	@echo source_packages_clean target complete.

source_packages_build: env_initialize env_generate_build_tag source_package_build_hash_router source_package_build_holism source_package_build_holism_metadata source_package_build_holism_services source_package_build_hrequest source_package_build_holarchy source_package_build_d2r2 source_package_build_d2r2_components
	@echo source_packages_build complete.

source_package_build_hash_router:
	@echo source_package_build_hash_router target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HASH_ROUTER)/
	mkdir -p $(DIR_BUILD_LIB_HASH_ROUTER)
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HASH_ROUTER)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HASH_ROUTER)/* $(DIR_BUILD_LIB_HASH_ROUTER)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/hash-router" > $(DIR_BUILD_LIB_HASH_ROUTER)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HASH_ROUTER)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HASH_ROUTER)

source_package_build_holism:
	@echo source_package_build_holism target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM)
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM)/.gitignore
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
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM_SERVICES)/.gitignore
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
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM_METADATA)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISM_METADATA)/* $(DIR_BUILD_LIB_HOLISM_METADATA)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holism-metadata" > $(DIR_BUILD_LIB_HOLISM_METADATA)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM_METADATA)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM_METADATA)

source_package_build_hrequest:
	@echo source_package_build_hrequest...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HREQUEST)/
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HREQUEST)/.gitignore
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
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLARCHY)/
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY)

	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLARCHY)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLARCHY)/* $(DIR_BUILD_LIB_HOLARCHY)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_HOLARCHY) --keep-file-extension --verbose $(DIR_SOURCES_LIB_HOLARCHY)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/holarchy" > $(DIR_BUILD_LIB_HOLARCHY)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLARCHY)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLARCHY)
	mkdir -p $(DIR_BUILD_LIB_HOLARCHY)/docs
	@echo source_package_build_holarchy complete.

source_package_build_d2r2:
	@echo source_package_build_d2r2...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_D2R2)/
	mkdir -p $(DIR_BUILD_LIB_D2R2)

	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_D2R2)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_D2R2)/* $(DIR_BUILD_LIB_D2R2)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_D2R2) --keep-file-extension --verbose $(DIR_SOURCES_LIB_D2R2)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/d2r2" > $(DIR_BUILD_LIB_D2R2)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_D2R2)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_D2R2)
	mkdir -p $(DIR_BUILD_LIB_D2R2)/docs
	@echo source_package_build_d2r2 complete.

source_package_build_d2r2_components:
	@echo source_package_build_d2r2_components...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_D2R2_COMPONENTS)/
	mkdir -p $(DIR_BUILD_LIB_D2R2_COMPONENTS)

	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_D2R2_COMPONENTS)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_D2R2_COMPONENTS)/* $(DIR_BUILD_LIB_D2R2_COMPONENTS)/
	$(TOOL_BABEL) --out-dir $(DIR_BUILD_LIB_D2R2_COMPONENTS) --keep-file-extension --verbose $(DIR_SOURCES_LIB_D2R2_COMPONENTS)

	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName "@encapsule/d2r2-components" > $(DIR_BUILD_LIB_D2R2_COMPONENTS)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_D2R2_COMPONENTS)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_D2R2_COMPONENTS)
	#	mkdir -p $(DIR_BUILD_LIB_D2R2_COMPONENTS)/docs
	@echo source_package_build_d2r2 complete.



# ================================================================
# Distribution Packages
#

# OPTIONAL: remove generated packages and clone distribution package repositories.
# Subsequently, evaluating the packages_update Makefile target will update the contents
# of the distribution repo which is typically then commited and published.
dist_packages_initialize: dist_packages_clean
	@echo BEGIN TARGET: dist_packages_initialize
	git clone git@github.com:Encapsule/holarchy.git $(DIR_DIST_LIB_HOLARCHY)
	git clone git@github.com:Encapsule/holism.git $(DIR_DIST_LIB_HOLISM)
	git clone git@github.com:Encapsule/holism-services.git $(DIR_DIST_LIB_HOLISM_SERVICES)
	git clone git@github.com:Encapsule/hrequest.git $(DIR_DIST_LIB_HREQUEST)
	git clone git@github.com:Encapsule/d2r2.git $(DIR_DIST_LIB_D2R2)
	git clone git@github.com:Encapsule/d2r2-components.git $(DIR_DIST_LIB_D2R2_COMPONENTS)
	git clone git@github.com:Encapsule/holism-metadata.git $(DIR_DIST_LIB_HOLISM_METADATA)
	git clone git@github.com:Encapsule/hash-router.git $(DIR_DIST_LIB_HASH_ROUTER)
	@echo FINISH TARGET: dist_packages_initialize

# OPTIONAL: check the status of the package distribution repositories.
dist_packages_status:
	@echo BEGIN TARGET: dist_packages_status

	@echo ================================================================
	cd $(DIR_DIST_LIB_HOLARCHY) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_HOLISM) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_HOLISM_SERVICES) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_HREQUEST) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_D2R2) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_D2R2_COMPONENTS) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_HOLISM_METADATA) && git remote -v && git status

	@echo ================================================================
	cd $(DIR_DIST_LIB_HASH_ROUTER) && git remote -v && git status

	@echo ================================================================
	@echo FINISH TARGET: dist_packages_status

dist_packages_clean: dist_packages_reset
	@echo COMPLETE TARGET: dist_packages_clean

dist_packages_reset:
	@echo BEGIN TARGET: dist_packages_reset
	rm -rf $(DIR_DISTS)/*
	@echo FINISH TARGET: dist_packages_reset

dist_packages_update: source_packages_build dist_package_update_holarchy dist_package_update_holism dist_package_update_holism_services dist_package_update_hrequest dist_package_update_d2r2 dist_package_update_d2r2_components dist_package_update_holism_metadata dist_package_update_hash_router
	@echo COMPLETE TARGET: dist_packages_update

dist_package_update_hash_router:
	@echo dist_package_update_hash_router starting...
	mkdir -p $(DIR_DIST_LIB_HASH_ROUTER)
	cp -Rp $(DIR_BUILD_LIB_HASH_ROUTER) $(DIR_DISTS_LIB)
	@echo dist_package_update_hash_router complete.

dist_package_update_holarchy:
	@echo stage_package_holism target starting...
	mkdir -p $(DIR_DIST_LIB_HOLARCHY)
	cp -Rp $(DIR_BUILD_LIB_HOLARCHY) $(DIR_DISTS_LIB)
	@echo stage_package_holism complete.

dist_package_update_holism:
	@echo stage_package_holism target starting...
	mkdir -p $(DIR_DIST_LIB_HOLISM)
	cp -Rp $(DIR_BUILD_LIB_HOLISM) $(DIR_DISTS_LIB)
	@echo stage_package_holism complete.

dist_package_update_holism_services:
	@echo stage_package_holism_services target starting...
	mkdir -p $(DIR_DIST_LIB_HOLISM_SERVICES)
	cp -Rp $(DIR_BUILD_LIB_HOLISM_SERVICES) $(DIR_DISTS_LIB)
	@echo stage_package_holism_services complete.

dist_package_update_holism_metadata:
	@echo stage_package_holism_metadata target starting...
	mkdir -p $(DIR_DIST_LIB_HOLISM_METADATA)
	cp -Rp $(DIR_BUILD_LIB_HOLISM_METADATA) $(DIR_DISTS_LIB)
	@echo stage_package_holism_metadata complete.

dist_package_update_hrequest:
	@echo stage_package_hrequest target starting...
	mkdir -p $(DIR_DIST_LIB_HREQUEST)
	cp -Rp $(DIR_BUILD_LIB_HREQUEST) $(DIR_DISTS_LIB)
	@echo stage_package_hrequest target complete.

dist_package_update_d2r2:
	@echo stage_package_d2r2 target starting...
	mkdir -p $(DIR_DIST_LIB_D2R2)
	cp -Rp $(DIR_BUILD_LIB_D2R2) $(DIR_DISTS_LIB)
	@echo stage_package_d2r2 target complete.

dist_package_update_d2r2_components:
	@echo stage_package_d2r2_components target starting...
	mkdir -p $(DIR_DIST_LIB_D2R2_COMPONENTS)
	cp -Rp $(DIR_BUILD_LIB_D2R2_COMPONENTS) $(DIR_DISTS_LIB)
	@echo stage_package_d2r2_components target complete.


# ================================================================
# Holistic platform runtime distribution packages.

platform_clean:
	@echo BEGIN TARGET: platform_clean
	rm -rf $(DIR_PLATFORM)/*
	@echo FINISH TARGET: platform_clean

platform_update: source_packages_clean dist_packages_clean dist_packages_update
	@echo BEGIN TARGET: platform_update
	mkdir -p $(DIR_PLATFORM)
	cp -p $(DIR_BUILD)/holistic.json $(DIR_PLATFORM)/
	cp -Rp $(DIR_DISTS_LIB)/* $(DIR_PLATFORM)
	@echo FINISH TARGET: platform_update

# ================================================================
# Utility
#

clean: source_packages_clean
	@echo Clean operation complete.

scrub: source_packages_clean dist_packages_clean
	@echo Scrub operation complete.

reset: source_packages_clean dist_packages_clean env_clean_cache
	@echo Reset operation complete.

