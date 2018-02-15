'use strict'

const Serializer = require('./')

describe('serializer', () => {

  it('replaces __dirname with <PROJECT_ROOT>', () => {

    const sut = __dirname
    expect(sut).toMatchSnapshot()

  })


  it('preserves path directories after the <PROJECT_ROOT>', () => {

    const sut = `${__dirname}/src/somewhere`
    expect(sut).toMatchSnapshot()

  })


  it('replaces __dirname with <PROJECT_ROOT> in Object properties', () => {

    const sut = {
      myPath: `${__dirname}/src`,
    }
    expect(sut).toMatchSnapshot()

  })


  it('supports trailing slashes in the path', () => {

    const sut = `${__dirname}/path/with/trailing/slash/`
    expect(sut).toMatchSnapshot()

  })


  it('replaces every instance of __dirname in the same string', () => {

    const sut = {
      PATH: `${__dirname}/path:${__dirname}/another/path`,
      script: `const myPath = ${__dirname}/path;
      const mySecondPath = ${__dirname}/another/path;`,
    }
    expect(sut).toMatchSnapshot()

  })

})


describe('serializer.test()', () => {

  it('returns true when val is a string and contains __dirname', () => {

    const val = `${__dirname}/a/path`
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns false when val is a string and does not contain __dirname', () => {

    const val = '/a/path'
    const result = Serializer.test(val)
    expect(result).toEqual(false)

  })

  it('returns true when val is an object with a property that contains __dirname', () => {

    const val = {
      property: `${__dirname}/a/path`,
      property2: '/no/dirname',
    }
    const result = Serializer.test(val)
    expect(result).toEqual(true)

  })

  it('returns false when val is an object with a property that does not contain __dirname', () => {

    const val = {
      property: '/a/path/',
      property2: '/no/dirname',
    }
    const result = Serializer.test(val)
    expect(result).toEqual(false)

  })

})


describe('serializer.print()', () => {

  it('replaces __dirname with <PROJECT_ROOT> when val is a string', () => {

    const ser = jest.fn()
    const val = `${__dirname}/a/path`
    const expected = '<PROJECT_ROOT>/a/path'
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

  it('replaces __dirname with <PROJECT_ROOT> in string property when val is an object', () => {

    const ser = jest.fn()
    const val = {
      property: `${__dirname}/a/path`,
      property2: '/no/dirname',
    }
    const expected = {
      property: '<PROJECT_ROOT>/a/path',
      property2: '/no/dirname',
    }
    Serializer.print(val, ser)
    expect(ser.mock.calls[0][0]).toEqual(expected)

  })

})
