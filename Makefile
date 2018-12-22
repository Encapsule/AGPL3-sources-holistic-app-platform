

DIR_ROOT=.
DIR_MODULES=$(DIR_ROOT)/node_modules
DIR_TOOLBIN=$(DIR_MODULES)/.bin

DIR_SOURCES=$(DIR_ROOT)/SOURCES
DIR_SOURCES_LIB=$(DIR_SOURCES)/LIB
DIR_SOURCES_LIB_HOLISM=$(DIR_SOURCES_LIB)/holism

TOOL_ESLINT=$(DIR_TOOLBIN)/eslint


package_holism: package_holism_lint package_holism_stage1
	@echo package_holism


package_holism_lint:
	@echo package_holism_lint
	$(TOOL_ESLINT) $(DIR_SOURCES_LIB_HOLISM)/

package_holism_stage1:
	@echo package_holism_stage1
