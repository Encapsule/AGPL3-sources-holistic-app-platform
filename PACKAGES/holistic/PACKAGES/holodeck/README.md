# [![](ASSETS/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project Homepage")](https://encapsule.io) Encapsule Project

**[ [Homepage](https://encapsule.io "Encapsule Project Homepage...") ] [ [GitHub](https://github.com/Encapsule "Encapsule Project GitHub...") ] [ [Twitter](https://twitter.com/Encapsule "Encapsule Project Twitter...") ] [ [Discussion](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group "Holistic app platform discussion group...") ]**

# ![](ASSETS/encapsule-holistic-48x48.png)&nbsp;@encapsule/holodeck v0.0.33 quatsino

```
Package: @encapsule/holodeck v0.0.33 "quatsino" build ID "U3C5O8hGTN6mRje5FZQ0Dw"
Sources: Encapsule/holistic-master#032cf574c27d38073122f7652a88ebd1c3081ac3
Purpose: library (Node.js)
Created: 2020-01-18T04:01:41.000Z
License: MIT
```

## ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;Description

Holdeck is a synchronous test runner and test harness system used to test @encapsule/holistic RTL's and derived apps and services.

## ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;Distribution

This package is an unpublished _pseudo-package_ that is included in the @encapsule/holistic v0.0.33 quatsino package for distribution via the `appgen` utility.

If you are viewing this README.md in the `./PACKAGES` subdirectory of the @encapsule/holistic package then you're looking at the source package that `appgen` will copy into your designated derived app/service git repo's `./HOLISTIC` directory.

If you are viewing this README.md in the `./HOLISTIC` subdirectory of your derived app/service repository then you're looking at the package that has been registered by _directory path_ (not package registry) in your derived app/service repo's `package.json` for the module require/import namespace `@encapsule/holodeck`.

## ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;Usage

In the context of your derived app/service repo, `appgen` will install and register `@encapsule/holodeck` by _directory path_ in your `package.json`.

@encapsule/holodeck can then be imported/required into any module in your project as follows:

Example script, `holodeck-example.js`:

```JavaScript
const holodeck = require('@encapsule/holodeck');
console.log(JSON.stringify(holodeck.__meta));
/* ... your derived code here ... */
```

## ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;Issues

Please post bug reports to one of the follow issue queues depending on topic:

- @encapsule/holistic [GitHub Issues](https://github.com/Encapsule/holistic/issues) - Holistic platform RTL + appgen issues.

- @encapsule/arccore [GitHub Issues](https://github.com/Encapsule/ARCcore/issues) - Core data RTL issues.

- @encapsule/arctools [GitHub Issue](https://github.com/Encapsule/ARCtools/issues) - Core data tools and RTL issues.

## ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;Discussion

Join the Holistic App Platform [discussion group](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group "Holistic app platform discussion group...") to talk about the architecture, design, development, and test of full-stack interactive HTML5 applications and services implemented in JavaScript, derived from [Holistic Platform Runtime](#-holistic-platform-runtime), and Facebook [React](https://reactjs.org). And, hosted on [Node.js](https://nodejs.org).

**[ [Top](#-encapsule-project "Scroll to the top of the page...") ]**

<hr>

[![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

Published under [MIT](LICENSE) license by [Encapsule Project](https://encapsule.io)

Please follow [@Encapsule](https://twitter.com/encapsule) on Twitter for news and updates.

Copyright &copy; 2020 [Christopher D. Russell](https://github.com/ChrisRus) Seattle, Washington USA

<hr>