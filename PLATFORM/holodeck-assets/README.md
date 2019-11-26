[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

### Encapsule Project

# @encapsule/holodeck-assets v0.0.26 "crazy-raven"

```
Package: @encapsule/holodeck-assets v0.0.26 "crazy-raven" build ID "-xhLsEhmTr6FkA_fNX5e7A"
Sources: Encapsule/holistic#d61e421b215e769f0aae28b8f97811618101d86b
Purpose: library (Node.js)
Created: 2019-11-26T16:15:21.000Z
License: MIT
```

# Summary

Holdeck assets bundles reusable test harnesses, and test vectors useful for testing apps and services derviced from @encapsule/holistic platform RTL's.

## Usage

This package's contained library functionality is intended for use in derived projects.

For example:

1. Create simple test project, declare a dependency and install `@encapsule/holodeck-assets` package:

```
$ mkdir testProject && cd testProject
$ yarn init
$ yarn add @encapsule/holodeck-assets --dev
```

2. Create a simple script `index.js`:

```JavaScript
const holodeck-assets = require('@encapsule/holodeck-assets');
console.log(JSON.stringify(holodeck-assets.__meta));
/* ... your derived code here ... */
```

## Documentation

## Distribution

The `@encapsule/holodeck-assets` library package is published on [npmjs](https://npmjs.com).

- [@encapsule/holodeck-assets Package Distribution](https://npmjs.com/package/@encapsule/holodeck-assets/v/0.0.26) ([@encapsule on npmjs.com](https://www.npmjs.com/org/encapsule))
- [Encapsule/holodeck-assets git Repository](https://github.com/Encapsule/holodeck-assets) ([GitHub](https://github.com/Encapsule))

<hr>

Published under [MIT](LICENSE) license by [Encapsule Project](https://encapsule.io) Seattle, Washington

Copyright &copy; 2019 [Christopher D. Russell](https://github.com/ChrisRus)