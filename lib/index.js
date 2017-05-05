'use strict'

// Replace absolute file paths with mocked

const dirname = __dirname.replace(/node_modules\/jest-serializer-path$/, '')

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
