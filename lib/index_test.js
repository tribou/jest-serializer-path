'use strict'

const Serializer = require('./')

describe('serializer', () => {

  it('replaces process.cwd with <PROJECT_ROOT>', () => {

    const sut = process.cwd()
    expect(sut).toMatchSnapshot()

  })


  it('preserves path directories after the <PROJECT_ROOT>', () => {

    const sut = `${process.cwd()}/src/somewhere`
    expect(sut).toMatchSnapshot()

  })


  it('replaces process.cwd with <PROJECT_ROOT> in Object properties', () => {

    const sut = {
      myPath: `${process.cwd()}/src`,
    }
    expect(sut).toMatchSnapshot()

  })

  it('replaces process.cwd with <PROJECT_ROOT> in array', () => {

    const sut = [`${process.cwd()}/src`]
    expect(sut).toMatchSnapshot()

  })

  it('supports trailing slashes in the path', () => {

    const sut = `${process.cwd()}/path/with/trailing/slash/`
    expect(sut).toMatchSnapshot()

  })


  it('replaces every instance of process.cwd in the same string', () => {

    const sut = {
      PATH: `${process.cwd()}/path:${process.cwd()}/another/path`,
      script: `const myPath = ${process.cwd()}/path;
      const mySecondPath = ${process.cwd()}/another/path;`,
    }
    expect(sut).toMatchSnapshot()

  })

})


describe('serializer.test()', () => {

  it('returns true when val is a string and contains process.cwd', () => {

    const val = `${process.cwd()}/a/path`
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns false when val is a string and does not contain process.cwd', () => {

    const val = '/a/path'
    const result = Serializer.test(val)
    expect(result).toEqual(false)

  })

  it('returns true when val is an object with a property that contains process.cwd', () => {

    const val = {
      property: `${process.cwd()}/a/path`,
      property2: '/no/dirname',
    }
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns false when val is an object with a property that does not contain process.cwd', () => {

    const val = {
      property: '/a/path/',
      property2: '/no/dirname',
    }
    const result = Serializer.test(val)
    expect(result).toEqual(false)

  })

  it('returns true when val is an array with a property that contains process.cwd', () => {

    const val = [`${process.cwd()}/a/path`, '/no/dirname']
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns false when val is an array with a property that does not contain process.cwd', () => {

    const val = ['/a/path/', '/no/dirname']
    const result = Serializer.test(val)
    expect(result).toEqual(false)

  })

})


describe('serializer.print()', () => {

  it('replaces process.cwd with <PROJECT_ROOT> when val is a string', () => {

    const ser = jest.fn()
    const val = `${process.cwd()}/a/path`
    const expected = '<PROJECT_ROOT>/a/path'
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

  it('replaces process.cwd with <PROJECT_ROOT> in string property when val is an object', () => {

    const ser = jest.fn()
    const val = {
      property: `${process.cwd()}/a/path`,
      property2: '/no/dirname',
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
    const val = [`${process.cwd()}/a/path`, '/no/dirname']
    const expected = ['<PROJECT_ROOT>/a/path', '/no/dirname']
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

})
