'use strict'

const path = require('path')
const Serializer = require('./')

const normalizePaths = Serializer.normalizePaths

describe('serializer', () => {

  it('replaces process.cwd with <PROJECT_ROOT>', () => {

    const sut = process.cwd()
    expect(sut).toMatchSnapshot()

  })


  it('preserves path directories after the <PROJECT_ROOT>', () => {

    const sut = path.resolve(process.cwd(), 'src/somewhere')
    expect(sut).toMatchSnapshot()

  })

  it('replaces process.cwd with <PROJECT_ROOT> when inside string', () => {

    const sut = `long string ${path.resolve(process.cwd(), 'src/somewhere')} path`
    expect(sut).toMatchSnapshot()

  })

  it('handles path inside string without process.cwd', () => {

    const sut = `long string ${path.resolve('/root/src/somewhere')} path`
    expect(sut).toMatchSnapshot()

  })

  it('replaces process.cwd with <PROJECT_ROOT> in Object properties', () => {

    const sut = {
      myPath: path.resolve(process.cwd(), 'src'),
    }
    expect(sut).toMatchSnapshot()

  })

  it('replaces process.cwd with <PROJECT_ROOT> in array', () => {

    const sut = [path.resolve(process.cwd(), 'src')]
    expect(sut).toMatchSnapshot()

  })

  it('replaces process.cwd with <PROJECT_ROOT> in an Error', () => {

    const sut = new Error(`some error in ${path.resolve(process.cwd(), 'a/path')}`)
    expect(sut).toMatchSnapshot()

  })

  it('supports trailing slashes in the path', () => {

    const sut = path.resolve(process.cwd(), 'path/with/trailing/slash/') + path.sep
    expect(sut).toMatchSnapshot()

  })

  it('handles process.chdir <PROJECT_ROOT>', () => {

    const cwd = process.cwd()

    const cwdUpdated = path.join(cwd, 'lib')
    process.chdir(cwdUpdated)

    const sut = path.resolve(process.cwd(), 'src/somewhere')
    expect(sut).toMatchSnapshot()

    process.chdir(cwd)

  })

  it('replaces every instance of process.cwd in the same string', () => {

    const sut = {
      PATH: `${path.resolve(process.cwd(), 'path')}:${path.resolve(process.cwd(), 'another/path')}`,
      script: `const myPath = ${path.resolve(process.cwd(), 'path')};
      const mySecondPath = ${path.resolve(process.cwd(), 'another/path')};`,
    }
    expect(sut).toMatchSnapshot()

  })

  it('handles an assortment of nested objects', () => {

    const sut = {
      nested: {
        myPath: path.resolve(process.cwd(), 'src'),
        arr: [
          path.resolve(process.cwd(), 'arr'),
          { arrPath: path.resolve(process.cwd(), 'arrPath') },
        ],
      },
    }
    expect(sut).toMatchSnapshot()

  })

})


describe('serializer.test()', () => {

  it('returns true when val is a string and contains process.cwd', () => {

    const val = path.resolve(process.cwd(), 'a/path')
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns true when val is an object with a property that contains process.cwd', () => {

    const val = {
      property: path.resolve(process.cwd(), 'a/path'),
      property2: path.resolve('/no/dirname'),
    }
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns true when val is an array with a property that contains process.cwd', () => {

    const val = [path.resolve(process.cwd(), 'a/path'), path.resolve('/no/dirname')]
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns true when val is an object with a property that contains process.cwd', () => {

    const val = new Error(`some error in ${path.resolve(process.cwd(), 'a/path')}`)
    val.code = 'HAS_CODE'
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns false when value does not change', () => {

    const val = 'some random string'
    const result = Serializer.test(val)
    expect(result).toEqual(false)

  })

})


describe('serializer.print()', () => {

  it('replaces process.cwd with <PROJECT_ROOT> when val is a string', () => {

    const ser = jest.fn()
    const val = path.resolve(process.cwd(), 'a/path')
    const expected = '<PROJECT_ROOT>/a/path'
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

  it('replaces process.cwd with <PROJECT_ROOT> in string property when val is an object', () => {

    const ser = jest.fn()
    const val = {
      property: path.resolve(process.cwd(), 'a/path'),
      property2: path.resolve('/no/dirname'),
    }
    const expected = {
      property: '<PROJECT_ROOT>/a/path',
      property2: '/no/dirname',
    }
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

  it('replaces process.cwd with <PROJECT_ROOT> in string property when val is an array', () => {

    const ser = jest.fn()
    const val = [path.resolve(process.cwd(), 'a/path'), path.resolve('/no/dirname')]
    const expected = ['<PROJECT_ROOT>/a/path', '/no/dirname']
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

  it('replaces process.cwd with <PROJECT_ROOT> in string property when val is an error', () => {

    const ser = jest.fn()
    const val = new Error(`some error in ${path.resolve(process.cwd(), 'a/path')}`)
    const expected = 'some error in <PROJECT_ROOT>/a/path'
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0].message).toEqual(expected)

  })

})

describe('normalizePaths', () => {

  it('removes windows drive from path', () => {

    const value = 'C:\\no\\dirname'

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('/no/dirname')

  })

  it('removes windows drive from path inside string', () => {

    const value = 'long C:\\no\\dirname string'

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('long /no/dirname string')

  })

  it('removes windows drive from path inside string', () => {

    const value = 'long C:\\no\\dirname string'

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('long /no/dirname string')

  })

  it('removes multiple windows drives', () => {

    const value = 'C:\\no\\dirname;C:\\other\\dirname'

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('/no/dirname;/other/dirname')

  })

  it('handles non-strings', () => {

    const value = 1

    const normalized = normalizePaths(value)
    expect(normalized).toEqual(1)

  })

})
