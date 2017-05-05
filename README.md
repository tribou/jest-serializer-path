# jest-serializer-path

[![npm version](https://badge.fury.io/js/jest-serializer-path.svg)](https://badge.fury.io/js/jest-serializer-path)
[![Build Status](https://travis-ci.org/tribou/jest-serializer-path.svg?branch=master)](https://travis-ci.org/tribou/jest-serializer-path)
[![Coverage Status](https://coveralls.io/repos/github/tribou/jest-serializer-path/badge.svg?branch=master)](https://coveralls.io/github/tribou/jest-serializer-path?branch=master)
[![Project Status: WIP - Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](http://www.repostatus.org/badges/latest/wip.svg)](http://www.repostatus.org/#wip)
[![bitHound Code](https://www.bithound.io/github/tribou/jest-serializer-path/badges/code.svg)](https://www.bithound.io/github/tribou/jest-serializer-path)

Remove absolute filepaths out of your Jest snapshots.

#### Quick Start

```
npm install --save-dev jest-serializer-path
```

Add this to your `package.json` Jest config:

```
"jest": {
  "snapshotSerializers": [
    "jest-serializer-path"
  ]
},
```

Or include only in individual tests:

```
const serializer = require('jest-serializer-path')

expect.addSnapshotSerializer(serializer)
```
