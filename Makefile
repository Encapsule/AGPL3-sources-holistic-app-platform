
DIR_ROOT=.
DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint

DIR_PROJECT=$(DIR_ROOT)/PROJECT
TOOL_GEN_REPO_BUILDTAG=$(DIR_PROJECT)/generate_encapsule_build.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PROJECT)/generate_package_manifest.js
TOOL_GEN_PACKAGE_LICENSE=$(DIR_PROJECT)/generate_package_license.js
TOOL_GEN_PACKAGE_README=$(DIR_PROJECT)/generate_package_readme.js

TOOL_GEN_FILTER_README=$(DIR_TOOLBIN)/arc_doc_filter

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism

DIR_BUILD_LIB_HOLISM_STAGE1=$(DIR_BUILD_LIB_HOLISM)/stage1

DIR_DISTS=$(DIR_ROOT)/DISTS
DIR_DIST_HOLISM=$(DIR_DISTS)/holism

package_holism: gen_repo_build_info
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/
	mkdir -p $(DIR_BUILD_LIB_HOLISM_STAGE1)
	cp -rv $(DIR_SOURCES_LIB_HOLISM)/* $(DIR_BUILD_LIB_HOLISM_STAGE1)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName holism > $(DIR_BUILD_LIB_HOLISM_STAGE1)/package.json
	$(TOOL_GEN_PACKAGE_LICENSE) --packageDir $(DIR_BUILD_LIB_HOLISM_STAGE1)
	$(TOOL_GEN_PACKAGE_README) --packageDir  $(DIR_BUILD_LIB_HOLISM_STAGE1)
	mkdir -p $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_STAGE1)/lib/http-server-filter-factory.js --output $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs/server-factory.md	
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_STAGE1)/lib/http-service-filter-factory.js --output $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs/service-factory.md	
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_STAGE1)/lib/http-integration-filters-factory.js --output $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs/integrations-factory.md	
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_STAGE1)/lib/http-response-write-filter.js --output $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs/server-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_STAGE1)/lib/http-response-serialize-filter.js --output $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs/service-result-response.md
	$(TOOL_GEN_FILTER_README) --filter $(DIR_BUILD_LIB_HOLISM_STAGE1)/lib/http-response-error-filter.js --output $(DIR_BUILD_LIB_HOLISM_STAGE1)/docs/service-error-response.md

publish_holism:
	cp -rv $(DIR_BUILD_LIB_HOLISM_STAGE1)/* $(DIR_DIST_HOLISM)/

clean: clean_build

clean_build:
	rm -rfv $(DIR_BUILD)/*

gen_repo_build_info:
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/encapsule_repo_build.json

distributions_initialize: clean_distributions
	git clone git@github.com:Encapsule/holism.git $(DIR_DIST_HOLISM)

clean_distributions:
	rm -rfv $(DIR_DISTS)/*

