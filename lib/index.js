'use strict'

/* eslint-disable no-param-reassign */

const slash = require('slash')

// Replace absolute file paths with <PROJECT_ROOT>
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
}

/**
 * Normalize paths across platforms.
 * Filters must be ran on all platforms to guard against false positives
 */
function normalizePaths (value) {

  if (typeof value !== 'string') {

    return value

  }

  const cwd = process.cwd()
  const replaceCwd = value.split(cwd).join('<PROJECT_ROOT>')

  // Remove win32 drive letters, C:\ -> \
  const removeWin32Drives = replaceCwd.replace(/[a-zA-Z]:\\/g, '\\')
  // Convert win32 backslash's to forward slashes, \ -> /
  const useForwardSlashes = slash(removeWin32Drives)

  return useForwardSlashes

}

function shouldUpdate (value) {

  // return true if value is different from normalized value
  return normalizePaths(value) !== value

}
