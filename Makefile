
DIR_ROOT=.
DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin
TOOL_ESLINT=$(DIR_TOOLBIN)/eslint

DIR_PROJECT=$(DIR_ROOT)/PROJECT
TOOL_GEN_REPO_BUILDTAG=$(DIR_PROJECT)/generate_encapsule_build.js
TOOL_GEN_PACKAGE_MANIFEST=$(DIR_PROJECT)/generate_package_manifest.js

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism

DIR_BUILD=$(DIR_ROOT)/BUILD
DIR_BUILD_LIB=$(DIR_BUILD)/LIB
DIR_BUILD_LIB_HOLISM=$(DIR_BUILD_LIB)/holism

DIR_BUILD_LIB_HOLISM_STAGE1=$(DIR_BUILD_LIB_HOLISM)/stage1



package_holism: package_holism_lint package_holism_stage1
	@echo package_holism

package_holism_lint:
	@echo package_holism_lint
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/

repo_build_info:
	$(TOOL_GEN_REPO_BUILDTAG) > $(DIR_BUILD)/encapsule_repo_build.json

package_holism_stage1: repo_build_info
	@echo package_holism_stage1
	mkdir -p $(DIR_BUILD_LIB_HOLISM_STAGE1)
	cp -rv $(DIR_SOURCES_LIB_HOLISM)/* $(DIR_BUILD_LIB_HOLISM_STAGE1)/
	$(TOOL_GEN_PACKAGE_MANIFEST) --packageName holism > $(DIR_BUILD_LIB_HOLISM_STAGE1)/package.json


