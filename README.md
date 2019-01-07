[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

# Encapsule/middleforks

## Access

The `Encapsule/middleforks` git repository on GitHub is _private_ with forking and write access enabled for specific organization members only.

## Summary

The `Encapsule/middleforks` repository is named after the confluence of the Taylor and Middle Fork of the Snoqualmie rivers South of the Alpine Lakes Wilderness Area in Washington State.

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

_Under construction._

### Catridges

### Inbox Apps

### Derived Apps























