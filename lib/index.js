'use strict'

// Replace absolute file paths with <PROJECT_ROOT>

const dirname = __dirname.substring(0, __dirname.indexOf('/node_modules/') + 1)

module.exports = {
  print (val/* : Object */, serialize/* : Function */) {

    Object.keys(val).forEach((key/* : string */) => {

      if (typeof val[key] === 'string'
        && val[key].indexOf(dirname) !== -1) {

        // eslint-disable-next-line
        val[key] = val[key].replace(dirname, '<PROJECT_ROOT>/')

      }

    })

    return serialize(val)

  },
  test (val) {

    let has = false
    if (val && typeof val === 'object') {

      Object.keys(val).forEach((key) => {

        if (typeof val[key] === 'string'
          && val[key].indexOf(dirname) !== -1) {

          has = true

        }

      })

    }

    return has

  },
}
