[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

### Encapsule Project

# @encapsule/holodeck v0.0.28 "pemberton"

```
Package: @encapsule/holodeck v0.0.28 "pemberton" build ID "3ffbeMD2R_uX9Wu9sSq_tQ"
Sources: Encapsule/holistic#11ffdf6655fa2b959c6763129c1778ba0c6d8ff9
Purpose: library (Node.js)
Created: 2019-12-10T15:26:38.000Z
License: MIT
```

# Summary

Holdeck is a synchronous test runner and test harness system used to test @encapsule/holistic RTL's and derived apps and services.

## Usage

This package's contained library functionality is intended for use in derived projects.

For example:

1. Create simple test project, declare a dependency and install `@encapsule/holodeck` package:

```
$ mkdir testProject && cd testProject
$ yarn init
$ yarn add @encapsule/holodeck --dev
```

2. Create a simple script `index.js`:

```JavaScript
const holodeck = require('@encapsule/holodeck');
console.log(JSON.stringify(holodeck.__meta));
/* ... your derived code here ... */
```

## Documentation

## Distribution

The `@encapsule/holodeck` library package is published on [npmjs](https://npmjs.com).

- [@encapsule/holodeck Package Distribution](https://npmjs.com/package/@encapsule/holodeck/v/0.0.28) ([@encapsule on npmjs.com](https://www.npmjs.com/org/encapsule))
- [Encapsule/holodeck git Repository](https://github.com/Encapsule/holodeck) ([GitHub](https://github.com/Encapsule))

<hr>

Published under [MIT](LICENSE) license by [Encapsule Project](https://encapsule.io) Seattle, Washington

Copyright &copy; 2019 [Christopher D. Russell](https://github.com/ChrisRus)