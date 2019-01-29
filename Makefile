# https://www.gnu.org/software/make/manual/make.html
# https://timmurphy.org/2015/09/27/how-to-get-a-makefile-directory-path/
# https://stackoverflow.com/questions/33126425/how-to-remove-the-last-trailing-backslash-in-gnu-make-file
# $(patsubst %\,%,$(__PATHS_FEATURE))

DIR_ROOT=$(patsubst %/,%,$(dir $(realpath $(firstword $(MAKEFILE_LIST)))))
$(info ***** Encapsule Project middleforks monorepo make *****)
$(info DIR_ROOT is $(DIR_ROOT))

DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint

DIR_PROJECT=$(DIR_ROOT)/PROJECT
DIR_PROJECT_ASSETS=$(DIR_PROJECT)/ASSETS
DIR_PROJECT_BUILD=$(DIR_PROJECT)/BUILD

TOOL_GEN_REPO_BUILDTAG=$(DIR_PROJECT)/generate_encapsule_build.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PROJECT)/generate_package_manifest.js
TOOL_GEN_PACKAGE_LICENSE=$(DIR_PROJECT)/generate_package_license.js
TOOL_GEN_PACKAGE_README=$(DIR_PROJECT)/generate_package_readme.js
TOOL_GEN_FILTER_README=$(DIR_TOOLBIN)/arc_doc_filter

TOOL_BABEL=$(DIR_TOOLBIN)/babel
TOOL_WEBPACK=$(DIR_TOOLBIN)/webpack-cli
TOOL_WEBPACK_FLAGS=--display-modules --verbose --debug --progress --colors --devtool source-map --output-pathinfo

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism
DIR_SOURCES_LIB_HREQUEST=$(DIR_SOURCES_LIB)/hrequest

DIR_SOURCES_APP=$(DIR_SOURCES)/APP
DIR_SOURCES_APP_ENCAPSULE=$(DIR_SOURCES_APP)/encapsule/encapsule.io

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism
DIR_BUILD_LIB_HREQUEST=$(DIR_BUILD_LIB)/hrequest

DIR_DISTS=$(DIR_ROOT)/DISTS
DIR_DISTS_LIB=$(DIR_DISTS)/LIB
DIR_DIST_LIB_HOLISM=$(DIR_DISTS_LIB)/holism
DIR_DIST_LIB_HREQUEST=$(DIR_DISTS_LIB)/hrequest

DIR_APPFACTORY_RUNTIME=$(DIR_ROOT)/HOLISTIC

DIR_BUILD_APP=$(DIR_BUILD)/APP
DIR_BUILD_APP_ENCAPSULE=$(DIR_BUILD_APP)/encapsule/encapsule.io
DIR_BUILD_APP_ENCAPSULE_PHASE1=$(DIR_BUILD_APP_ENCAPSULE)/phase1-transpile
DIR_BUILD_APP_ENCAPSULE_PHASE2=$(DIR_BUILD_APP_ENCAPSULE)/phase2-webpack

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
	@echo monorepo_initialize target starting...
	yarn install --verbose
	@echo monorepo_initialize target complete.

env_reinitialize: env_clean_cache env_initialize
	@echo Your local yarn cache has been repopulated with fresh packages from the Internet. And the contents of $(DIR_MODULES) has been rewritten.

env_clean:
	@echo monorepo_clean target starting...
	rm -rf $(DIR_MODULES)
	@echo monorepo_clean target complete.

env_clean_cache: env_clean
	@echo monorepo_nuke target starting...
	yarn cache clean
	@echo monorepo_nuke target complete.

env_generate_build_tag:
	@echo generate_build_info target starting...
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/holistic.json
	@echo generate_build_info target complete.

# ================================================================
# Source Package Targets

source_packages_clean:
	@echo BEGIN TARGET: source_packages_clean
	rm -rf $(DIR_BUILD)/*
	@echo FINISH TARGET: source_packages_clean

source_packages_build: env_initialize env_generate_build_tag source_package_build_holism source_package_build_hrequest
	@echo COMPLETE TARGET: source_packages_build

source_package_build_holism:
	@echo build_package_holism target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM)
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HOLISM)/* $(DIR_BUILD_LIB_HOLISM)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName holism > $(DIR_BUILD_LIB_HOLISM)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM)
	mkdir -p $(DIR_BUILD_LIB_HOLISM)/docs
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-server-filter-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/server-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-service-filter-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-integration-filters-factory.js --output $(DIR_BUILD_LIB_HOLISM)/docs/integrations-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-response-write-filter.js --output $(DIR_BUILD_LIB_HOLISM)/docs/server-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-response-serialize-filter.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-result-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM)/lib/http-response-error-filter.js --output $(DIR_BUILD_LIB_HOLISM)/docs/service-error-response.md
	@echo build_package_holism target complete.

source_package_build_hrequest:
	@echo build_package_holism target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HREQUEST)/
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)
	cp -p $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HREQUEST)/.gitignore
	cp -Rp $(DIR_SOURCES_LIB_HREQUEST)/* $(DIR_BUILD_LIB_HREQUEST)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName hrequest > $(DIR_BUILD_LIB_HREQUEST)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HREQUEST)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HREQUEST)
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)/docs
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/server-factory.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/server-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/client-factory.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/client-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/lib/http-request-filter-factory.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/request-factory.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/lib/http-request-transport-for-node.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/server-request-transport.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HREQUEST)/lib/http-request-transport-for-browser.js --output $(DIR_BUILD_LIB_HREQUEST)/docs/client-request-transport.md
	@echo build_package_request complete.

# ================================================================
# Distribution Packages
#

# OPTIONAL: remove generated packages and clone distribution package repositories.
# Subsequently, evaluating the packages_update Makefile target will update the contents
# of the distribution repo which is typically then commited and published.
dist_packages_initialize: dist_packages_clean
	@echo BEGIN TARGET: dist_packages_initialize
	git clone git@github.com:Encapsule/holism.git $(DIR_DIST_LIB_HOLISM)
	git clone git@github.com:Encapsule/hrequest.git $(DIR_DIST_LIB_HREQUEST)
	@echo FINISH TARGET: dist_packages_initialize

# OPTIONAL: check the status of the package distribution repositories.
dist_packages_status:
	@echo BEGIN TARGET: dist_packages_status
	@echo ================================================================
	cd $(DIR_DIST_LIB_HOLISM) && git remote -v && git status
	@echo ================================================================
	cd $(DIR_DIST_LIB_HREQUEST) && git remote -v && git status
	@echo FINISH TARGET: dist_packages_status

dist_packages_clean: dist_packages_nuke
	@echo COMPLETE TARGET: dist_packages_clean

dist_packages_nuke:
	@echo BEGIN TARGET: dist_packages_nuke
	rm -rf $(DIR_DISTS)/*
	@echo FINISH TARGET: dist_packages_nuke

dist_packages_update: source_packages_build dist_package_update_holism dist_package_update_hrequest
	@echo COMPLETE TARGET: dist_packages_update

dist_package_update_holism:
	@echo stage_package_holism target starting...
	mkdir -p $(DIR_DIST_LIB_HOLISM)
	cp -Rp $(DIR_BUILD_LIB_HOLISM) $(DIR_DISTS_LIB)
	@echo stage_package_holism complete.

dist_package_update_hrequest:
	@echo stage_package_hrequest target starting...
	mkdir -p $(DIR_DIST_LIB_HREQUEST)
	cp -Rp $(DIR_BUILD_LIB_HREQUEST) $(DIR_DISTS_LIB)
	@echo stage_package_hrequest target complete.

# ================================================================
# App Factory

appfactory_clean:
	@echo BEGIN TARGET: appfactory_clean
	rm -rf $(DIR_APPFACTORY)/*
	@echo FINISH TARGET: appfactory_clean

appfactory_update: source_packages_clean dist_packages_clean dist_packages_update
	@echo BEGIN TARGET: appfactory_update
	mkdir -p $(DIR_APPFACTORY_RUNTIME)
	cp -p $(DIR_BUILD)/holistic.json $(DIR_APPFACTORY_RUNTIME)/
	cp -Rp $(DIR_DISTS_LIB)/* $(DIR_APPFACTORY_RUNTIME)
	@echo FINISH TARGET: appfactory_update


# ================================================================
# Utility
#

clean: source_packages_clean
	@echo Clean operation complete.

scrub: source_packages_clean dist_packages_clean
	@echo Scrub operation complete.

nuke: source_packages_clean dist_packages_clean env_clean_cache
	@echo Nuke operation complete.


# ================================================================
# Experiments
#

build_app_encapsule: stage_packages
	mkdir -p $(DIR_BUILD_APP_ENCAPSULE_PHASE1)
	$(TOOL_BABEL) --config-file $(DIR_ROOT)/.babelrc --out-dir $(DIR_BUILD_APP_ENCAPSULE_PHASE1) --keep-file-extension --verbose $(DIR_SOURCES_APP_ENCAPSULE)

	rm -rf  $(DIR_BUILD_APP_ENCAPSULE_PHASE1)/content
	mkdir -p  $(DIR_BUILD_APP_ENCAPSULE_PHASE1)/content
	cp -Rp $(DIR_SOURCES_APP_ENCAPSULE)/content/* $(DIR_BUILD_APP_ENCAPSULE_PHASE1)/content/

	cp -p $(DIR_SOURCES_APP_ENCAPSULE)/server/integrations/*.hbs $(DIR_BUILD_APP_ENCAPSULE_PHASE1)/server/integrations/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName app_encapsule_io > $(DIR_BUILD_APP_ENCAPSULE_PHASE1)/package.json
#	https://stackoverflow.com/questions/25956937/how-to-build-minified-and-uncompressed-bundle-with-webpack
	$(TOOL_WEBPACK) $(TOOL_WEBPACK_FLAGS) --config $(DIR_PROJECT_BUILD)/webpack.config.app_encapsule_io.server
	$(TOOL_WEBPACK) $(TOOL_WEBPACK_FLAGS) --config $(DIR_PROJECT_BUILD)/webpack.config.app_encapsule_io.client
	cp -Rp $(DIR_BUILD_APP_ENCAPSULE_PHASE1)/content $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/

	rm -rf $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/client
	mkdir -p $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/client

	cp -p $(DIR_SOURCES_APP_ENCAPSULE)/client/index.html $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/client/index.html
	cp -Rp $(DIR_SOURCES_APP_ENCAPSULE)/client/css $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/client/css
	cp -Rp $(DIR_SOURCES_APP_ENCAPSULE)/client/fonts $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/client/fonts
	cp -Rp $(DIR_SOURCES_APP_ENCAPSULE)/client/images $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/client/images
	cp -Rp $(DIR_SOURCES_APP_ENCAPSULE)/server/robots.txt $(DIR_BUILD_APP_ENCAPSULE_PHASE2)/robots.txt


test:
	@echo test $(fuck)
