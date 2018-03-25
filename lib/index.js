'use strict'

/* eslint-disable no-param-reassign */

// Replace absolute file paths with <PROJECT_ROOT>

const cwd = process.cwd()

module.exports = {
  print (val, serialize) {

    if (isPath(val)) {

      val = val.split(cwd).join('<PROJECT_ROOT>')

    }
    else if (val instanceof Error) {

      val.message = val.message.split(cwd).join('<PROJECT_ROOT>')

    }
    else {

      Object.keys(val).forEach(key => {

        if (isPath(val[key])) {

          val[key] = val[key].split(cwd).join('<PROJECT_ROOT>')

        }

      })

    }

    return serialize(val)

  },
  test (val) {

    let has = false

    if (val instanceof Error && isPath(val.message)) {

      has = true

    }
    else if (val && typeof val === 'object') {

      Object.keys(val).forEach(key => {

        if (isPath(val[key])) {

          has = true

        }

      })

    }
    else if (isPath(val)) {

      has = true

    }

    return has

  },
}

function isPath (value) {

  return typeof value === 'string'
    && value.indexOf(cwd) !== -1

}
