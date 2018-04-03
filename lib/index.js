'use strict'

/* eslint-disable no-param-reassign */

const slash = require('slash')
const os = require('os')
const path = require('path')
const realPathSync = require('fs').realpathSync

module.exports = {
  print (val, serialize) {

    if (val instanceof Error) {

      val.message = normalizePaths(val.message)

    }
    else if (typeof val === 'object') {

      Object.keys(val).forEach(key => {

        val[key] = normalizePaths(val[key])

      })

    }
    else {

      val = normalizePaths(val)

    }

    return serialize(val)

  },
  test (val) {

    let has = false

    if (val instanceof Error && shouldUpdate(val.message)) {

      has = true

    }
    else if (val && typeof val === 'object') {

      Object.keys(val).forEach(key => {

        if (shouldUpdate(val[key])) {

          has = true

        }

      })

    }
    else if (shouldUpdate(val)) {

      has = true

    }

    return has

  },
  normalizePaths,
  getRealPath,
}

/**
 * Normalize paths across platforms.
 * Filters must be ran on all platforms to guard against false positives
 */
function normalizePaths (value) {

  if (typeof value !== 'string') {

    return value

  }

  // Follow symlinks using realPathSync (NOT TESTED)
  const cwd = process.cwd()
  const cwdReal = getRealPath(cwd)
  const tempDir = os.tmpdir()
  const tempDirReal = getRealPath(tempDir)
  const homeDir = os.homedir()
  // const homeDirReal = getRealPath(homeDir)

  const homeRelativeToTemp = path.relative(tempDir, homeDir)

  const runner = [
    // Replace process.cwd with <PROJECT_ROOT>
    val => val.split(cwd).join('<PROJECT_ROOT>'),
    val => val.split(cwdReal).join('<PROJECT_ROOT>'),
    // Replace home directory with <TEMP_DIR>
    val => val.split(tempDir).join('<TEMP_DIR>'),
    val => val.split(tempDirReal).join('<TEMP_DIR>'),
    // Replace home directory with <HOME_DIR>
    val => val.split(homeDir).join('<HOME_DIR>'),
    // val => val.split(homeDirReal).join('<HOME_DIR>'),
    // handle HOME_DIR nested inside TEMP_DIR
    val => val.split(`<TEMP_DIR>${path.sep + homeRelativeToTemp}`).join('<HOME_DIR>'),
    // Remove win32 drive letters, C:\ -> \
    val => val.replace(/[a-zA-Z]:\\/g, '\\'),
    // Convert win32 backslash's to forward slashes, \ -> /
    val => slash(val),
  ]

  let result = value
  runner.forEach(current => {

    result = current(result)

  })

  return result

}

function shouldUpdate (value) {

  // return true if value is different from normalized value
  return normalizePaths(value) !== value

}

function getRealPath (pathname) {

  try {

    const realPath = realPathSync(pathname)

    return realPath

  }
  catch (error) {

    return pathname

  }

}
