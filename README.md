[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

# Encapsule/holistic

## Access

The `Encapsule/holistic` repository will be published under the MIT license later in 2019 when it is both stable and well-documented. But, until it's ready this repository is **private** and accessible only to specific members of the Encapsule Project GitHub organization. **DO NOT PUBLISH**

## Summary

This repository provides common dependency management, build, test, and packaging for the Encapsule Project application development stack for Node.js/HTML5.

## Packages

The following Encapsule Project Node.js packages are generated from source code and build process versioned in this git repository:

- [@encapsule/holism](https://github.com/Encapsule/holism) - Declaratively-configured HTTP 1.1 application server for Node.js extensible with plug-in filter objects.
- [@encapsule/holistic](https://github.com/Encapsule/holistic) - Framework for buiding full-stack Node.js/HTML5 applications derived from React and Encapsule Project infrastructure.
- [@encapsule/hrequest](https://github.com/Encapsule/hrequest) - Declaratively-configured asynchronous HTTP request filters for Node.js and browser clients.
- [@encapsule/holarchy](https://github.com/Encapsule/holarchy) - future library not yet published
- [@encapsule/holan](https://github.com/Encapsule/holan) - future library not yet published

Distribution packages (i.e. they have a `package.json` file) are built from sources stored in the `SOURCES/LIB` directory.

The build process is codified as a GNU Makefile that leverages 3rd-party and custom tools stored in `node_modules` and `PROJECT` directories respectively.

Final distribution packages are staged into the `DISTS/LIB` directory.

Disitribution packages are symbolically linked into this package's `node_modules` directory.

## Applications

### Infusion

#### Asset Generation

##### package.json

- `yarn run` targets
    - install
    - clean
    - build
    - test
    - start
    - package
- 3rd-party build/test/runtime dependencies
    - Application-specific dependencies (from application's original package.json)
    - Holistic framework dependencies (from holistic framework package)

##### yarn.lock
    - udpated commit hashes for any/all of the application's build/test/packaging/and runtime dependencies

##### Runtime
    - Inline copies of the core runtime libraries that comprise the holistic web application framework.


### Catridges



<hr>

Published by [Encapsule Project](https://encapsule.io) Seattle, Washington

Copyright &copy; 2011-2019 [Christopher D. Russell](http://chrisrussell.net)





















