# jest-serializer-path

[![npm version](https://badge.fury.io/js/jest-serializer-path.svg)](https://badge.fury.io/js/jest-serializer-path)
[![CircleCI](https://circleci.com/gh/tribou/jest-serializer-path.svg?style=svg)](https://circleci.com/gh/tribou/jest-serializer-path)
[![Coverage Status](https://coveralls.io/repos/github/tribou/jest-serializer-path/badge.svg?branch=master)](https://coveralls.io/github/tribou/jest-serializer-path?branch=master)
[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](http://www.repostatus.org/badges/latest/active.svg)](http://www.repostatus.org/#active)
[![bitHound Code](https://www.bithound.io/github/tribou/jest-serializer-path/badges/code.svg)](https://www.bithound.io/github/tribou/jest-serializer-path)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Ftribou%2Fjest-serializer-path.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Ftribou%2Fjest-serializer-path?ref=badge_shield)

Remove absolute paths from your Jest snapshots.

#### Quick Start

```bash
npm install --save-dev jest-serializer-path
```

Add this to your `package.json` Jest config:

```
"jest": {
  "snapshotSerializers": [
    "jest-serializer-path"
  ]
}
```

Or include only in individual tests:

```js
const serializer = require('jest-serializer-path')

expect.addSnapshotSerializer(serializer)
```

All absolute paths will now be converted and saved in snapshots like so:

`/path/to/my-proj/lib` => `<PROJECT_ROOT>/lib`

#### Build

This project bundles the yarn executable and the npm/yarn dependencies offline
in the `.npm-packages-offline-cache` directory for faster dependency installs
and better dev/prod parity including preventing failure if yarn/npm is
offline.

```sh
# Install
npm run yarn

# Run tests
npm run test
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Ftribou%2Fjest-serializer-path.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Ftribou%2Fjest-serializer-path?ref=badge_large)
