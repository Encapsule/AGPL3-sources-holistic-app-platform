
DIR_ROOT=.
DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint

DIR_PROJECT=$(DIR_ROOT)/PROJECT

DIR_PROJECT_ASSETS=$(DIR_PROJECT)/ASSETS

TOOL_GEN_REPO_BUILDTAG=$(DIR_PROJECT)/generate_encapsule_build.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PROJECT)/generate_package_manifest.js
TOOL_GEN_PACKAGE_LICENSE=$(DIR_PROJECT)/generate_package_license.js
TOOL_GEN_PACKAGE_README=$(DIR_PROJECT)/generate_package_readme.js

TOOL_GEN_FILTER_README=$(DIR_TOOLBIN)/arc_doc_filter

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism
DIR_SOURCES_LIB_HREQUEST=$(DIR_SOURCES_LIB)/hrequest

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism
DIR_BUILD_LIB_HREQUEST=$(DIR_BUILD_LIB)/hrequest

DIR_DISTS=$(DIR_ROOT)/DISTS
DIR_DISTS_LIB=$(DIR_DISTS)/LIB
DIR_DIST_LIB_HOLISM=$(DIR_DISTS_LIB)/holism
DIR_DIST_LIB_HREQUEST=$(DIR_DISTS_LIB)/hrequest

default: stage_packages
	@echo \'default\' Makefile target build complete.

build_packages: monorepo_initialize generate_build_info build_package_holism build_package_hrequest
	@echo build_packages complete

build_package_holism:
	@echo build_package_holism target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM)
	cp $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HOLISM)/.gitignore
	cp -rv $(DIR_SOURCES_LIB_HOLISM)/* $(DIR_BUILD_LIB_HOLISM)/
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

build_package_hrequest:
	@echo build_package_holism target starting...
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HREQUEST)/
	mkdir -p $(DIR_BUILD_LIB_HREQUEST)
	cp $(DIR_PROJECT_ASSETS)/lib-package-gitignore $(DIR_BUILD_LIB_HREQUEST)/.gitignore
	cp -rv $(DIR_SOURCES_LIB_HREQUEST)/* $(DIR_BUILD_LIB_HREQUEST)/
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

stage_packages: build_packages stage_package_holism stage_package_hrequest
	@echo Stage pacakges operation complete.

stage_package_holism:
	@echo stage_package_holism target starting...
	mkdir -p $(DIR_DIST_LIB_HOLISM)
	cp -rv $(DIR_BUILD_LIB_HOLISM) $(DIR_DISTS_LIB)
	@echo stage_package_holism complete.

stage_package_hrequest:
	@echo stage_package_hrequest target starting...
	mkdir -p $(DIR_DIST_LIB_HREQUEST)
	cp -rv $(DIR_BUILD_LIB_HREQUEST) $(DIR_DISTS_LIB)
	@echo stage_package_hrequest target complete.

clean: build_clean
	@echo Clean operation complete.

scrub: build_clean distributions_clean monorepo_clean
	@echo Scrub operation complete.

nuke: build_clean distributions_nuke monorepo_nuke
	@echo Nuke operation complete.

build_clean:
	@echo build_clean target starting...
	rm -rfv $(DIR_BUILD)/*
	@echo build_clean target complete.

distributions_initialize: distributions_clean
	@echo distributions_initialize target starting...
	git clone git@github.com:Encapsule/holism.git $(DIR_DIST_LIB_HOLISM)
	git clone git@github.com:Encapsule/hrequest.git $(DIR_DIST_LIB_HREQUEST)
	@echo distributions_initialize target complete.

distributions_status:
	@echo distributions_status target starting...
	@echo ================================================================
	cd $(DIR_DIST_LIB_HOLISM) && git remote -v && git status
	@echo ================================================================
	cd $(DIR_DIST_LIB_HREQUEST) && git remote -v && git status
	@echo distributions_status target complete.

distributions_clean: distributions_nuke
	@echo Distributions clean operation complete.

distributions_nuke:
	@echo distributions_nuke target starting...
	rm -rfv $(DIR_DISTS)/*
	@echo distributions_nuke target complete.

generate_build_info:
	@echo generate_build_info target starting...
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/build.json
	@echo generate_build_info target complete.

monorepo_initialize:
	@echo monorepo_initialize target starting...
	yarn install --verbose
	@echo monorepo_initialize target complete.

monorepo_reinitialize: monorepo_nuke monorepo_initialize
	@echo Your local yarn cache has been repopulated with fresh packages from the Internet. And the contents of $(DIR_MODULES) has been rewritten.

monorepo_clean:
	@echo monorepo_clean target starting...
	rm -rfv $(DIR_MODULES)
	@echo monorepo_clean target complete.

monorepo_nuke: monorepo_clean
	@echo monorepo_nuke target starting...
	yarn cache clean
	@echo monorepo_nuke target complete.
