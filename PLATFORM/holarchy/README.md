[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

### Encapsule Project

# @encapsule/holarchy v0.0.25 "stryker"

```
Package: @encapsule/holarchy v0.0.25 "stryker" build ID "pObY3gLjRvi8GyFnGXvSjw"
Sources: Encapsule/holistic#2378d66f9b9e3a59964ecff759278e4fc6ff17b8
Purpose: library (Node.js)
Created: 2019-11-17T02:41:30.000Z
License: MIT
```

# Summary

Holistic server and client application runtime factories, re-usable plug-in export library.

## Usage

This package's contained library functionality is intended for use in derived projects.

For example:

1. Create simple test project, declare a dependency and install `@encapsule/holarchy` package:

```
$ mkdir testProject && cd testProject
$ yarn init
$ yarn add @encapsule/holarchy --dev
```

2. Create a simple script `index.js`:

```JavaScript
const holarchy = require('@encapsule/holarchy');
console.log(JSON.stringify(holarchy.__meta));
/* ... your derived code here ... */
```

## Documentation

## Distribution

The `@encapsule/holarchy` library package is published on [npmjs](https://npmjs.com).

- [@encapsule/holarchy Package Distribution](https://npmjs.com/package/@encapsule/holarchy/v/0.0.25) ([@encapsule on npmjs.com](https://www.npmjs.com/org/encapsule))
- [Encapsule/holarchy git Repository](https://github.com/Encapsule/holarchy) ([GitHub](https://github.com/Encapsule))

<hr>

Published under [MIT](LICENSE) license by [Encapsule Project](https://encapsule.io) Seattle, Washington

Copyright &copy; 2019 [Christopher D. Russell](https://github.com/ChrisRus)