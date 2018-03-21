'use strict'

// @flow

// Replace absolute file paths with <PROJECT_ROOT>

const cwd = process.cwd()

/*::
type Val = string | Object
 */

module.exports = {
  print (val/* : Val */, serialize/* : Function */) {

    if (isPath(val)) {

      // eslint-disable-next-line
      val = val.split(cwd).join('<PROJECT_ROOT>')

    }
    else {

      Object.keys(val).forEach(key => {

        if (isPath(val[key])) {

          // eslint-disable-next-line
          val[key] = val[key].split(cwd).join('<PROJECT_ROOT>')

        }

      })

    }

    return serialize(val)

  },
  test (val/* : Val */) {

    let has = false
    if (val && typeof val === 'object') {

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
