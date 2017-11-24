'use strict'

const serializer = require('./')

expect.addSnapshotSerializer(serializer)

it('replaces __dirname with <PROJECT_ROOT>', () => {

  const olddirname = __dirname
  global.__dirname = '/Path/to/my/proj/node_modules/some-module'

  const sut = {
    __dirname,
  }

  console.log(sut)
  expect(sut).toMatchSnapshot()

  global.__dirname = olddirname

})
