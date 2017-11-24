'use strict'

/* eslint-disable global-require */

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
