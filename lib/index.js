'use strict'

// Replace absolute file paths with <PROJECT_ROOT>

const dirname = __dirname.substring(0, __dirname.indexOf('/node_modules/'))

module.exports = {
  print (val/* : Object */, serialize/* : Function */) {

    if (isPath(val)) {

      // eslint-disable-next-line
      val = val.replace(dirname, '<PROJECT_ROOT>')

    }
    else {

      Object.keys(val).forEach(key/* : string */ => {

        if (isPath(val[key])) {

          // eslint-disable-next-line
          val[key] = val[key].replace(dirname, '<PROJECT_ROOT>')

        }

      })

    }

    return serialize(val)

  },
  test (val) {

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
    && value.indexOf(dirname) !== -1

}
