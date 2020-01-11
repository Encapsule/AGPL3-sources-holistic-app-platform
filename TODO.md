# TODO list

## @encapsule/holistic distribution package

### Step 1 - docs cleanup / stripdown

- Remove clutter from all the generated @encapsule/* README.md files.
- @encapsule/holistic README.md
    - Overview section
    - Usage section (generated but confirm details)
    - Package summary
        - Generate the package summary content

### Step 2 - holistic-master Makefile refinements

- Add another holistic-master Makefile target for the holistic package
    - Add index.js
    - Add static assets like docs (not top-level README.md) and graphics
    - Move `appgen.js` to /SOURCES/LIB/holistic
    - Rename `appgen.js` to `appgen` update package.json bin link
- Update holistic-master Makefile to build holistic package in BUILD
- Update the distribution package makefile target for holistic to binplace the BUILD package and then copy the remaining pieces not acheived in the holistic package BUILD (e.g. copying the RTL distribution packages prepared as peers during initial Makefile BUILD)

#### Step 3 - back to holistic platform RTL's

# DONE




