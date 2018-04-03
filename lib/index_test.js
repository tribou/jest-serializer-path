'use strict'

/* eslint-disable */

const path = require('path')
const os = require('os')
const fse = require('fs-extra')
const Serializer = require('./')

const normalizePaths = Serializer.normalizePaths
const getRealPath = Serializer.getRealPath

const cwd = process.cwd()

beforeEach(() => {
  jest.restoreAllMocks()
})

afterEach(() => {
  if (process.cwd() !== cwd) {
    console.log('here')
    process.chdir(cwd)
  }
})

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

  it('replaces all roots', () => {

    const homeDir = os.homedir()
    const tempDir = os.tmpdir()
    const cwd = process.cwd()

    const sut = {
      home: path.resolve(homeDir, 'nested/home'),
      temp: path.resolve(tempDir, 'nested/temp'),
      cwd: path.resolve(cwd, 'nested/cwd'),
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

  it('replaces home directory with HOME_DIR', () => {

    const homeDir = os.homedir()

    const value = path.resolve(homeDir, 'some/nested/dir')

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('<HOME_DIR>/some/nested/dir')

  })

  it('replaces temp directory with TEMP_DIR', () => {

    const tempDir = os.tmpdir()

    const value = path.resolve(tempDir, 'some/nested/dir')

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('<TEMP_DIR>/some/nested/dir')

  })

  it('use <PROJECT_ROOT> when nested inside <HOME_DIR>', () => {

    const homeDir = os.homedir()

    process.chdir(homeDir)

    const value = path.resolve(homeDir, 'some/nested/dir')

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('<PROJECT_ROOT>/some/nested/dir')

  })

  it('use <TEMP_DIR> when nested inside <HOME_DIR>', () => {

    const homeDir = os.homedir()
    const tempDir = path.resolve(homeDir, 'temp-dir')

    jest.spyOn(os, 'tmpdir')
      .mockImplementation(() => tempDir)

    const value = path.resolve(tempDir, 'some/nested/dir')

    const normalized = normalizePaths(value)
    expect(normalized).toEqual('<TEMP_DIR>/some/nested/dir')

  })

  it('use <HOME_DIR> when nested inside <TEMP_DIR>', () => {

    const tempDir = os.tmpdir()
    const homeDir = path.resolve(tempDir, 'home-dir')

    const homeDirSpy = jest.spyOn(os, 'homedir')
      .mockImplementation(() => homeDir)

    const value = path.resolve(homeDir, 'some/nested/dir')

    const normalized = normalizePaths(value)

    expect(normalized).toEqual('<HOME_DIR>/some/nested/dir')

  })

  describe('symlinks', () => {
    const tempDir = path.resolve(os.tmpdir(), 'jest-serializer-path');

    beforeEach(() => {
      /**
       * Ensures that a directory is empty.
       * Deletes directory contents if the directory is not empty.
       * If the directory does not exist, it is created.
       * The directory itself is not deleted.
       */
      fse.emptyDirSync(tempDir)
    })

    afterAll(() => {
      fse.removeSync(tempDir)
    })

    it('handles process.cwd as symlink', () => {
      const realCwd = getRealPath(cwd)
      const linkedCwd = path.resolve(tempDir, 'fake-cwd')

      /**
       * normally would use process.chdir to update process.cwd but
       * process.chdir seems to already use the real filesystem path
       *
       * mock process.cwd to handle edge cases when a real filesystem path
       * is not returned
       */
      jest.spyOn(process, 'cwd')
        .mockImplementation(() => linkedCwd)

      fse.ensureSymlinkSync(realCwd, linkedCwd)

      const value = path.resolve(realCwd, 'some/nested/dir')

      const normalized = normalizePaths(value)
      expect(normalized).toEqual('<PROJECT_ROOT>/some/nested/dir')
    })

    it('handles temp dir as symlink', () => {
      const realTempDir = getRealPath(tempDir)

      const linkedTempDir = path.resolve(realTempDir, 'fake-tmp')

      jest.spyOn(os, 'tmpdir')
        .mockImplementation(() => linkedTempDir)

      fse.ensureSymlinkSync(tempDir, linkedTempDir)

      const value = path.resolve(realTempDir, 'some/nested/dir')

      const normalized = normalizePaths(value)
      expect(normalized).toEqual('<TEMP_DIR>/some/nested/dir')

    })


    /**
     * currently returning on osx:
     * /private<TEMP_DIR>/jest-serializer-path/fake-home/some/nested/dir
     */
    it('handles home dir as symlink', () => {
      const realTempDir = getRealPath(tempDir)

      const linkedHomeDir = path.resolve(realTempDir, 'fake-home')

      fse.ensureSymlinkSync(tempDir, linkedHomeDir)

      const value = path.resolve(linkedHomeDir, 'some/nested/dir')

      const normalized = normalizePaths(value)
      expect(normalized).toEqual('<HOME_DIR>/some/nested/dir')

    })

    it.skip('handles fakePath inside realPath', () => {
      const realTempDir = getRealPath(tempDir)
      const realHomeDir = getRealPath(os.homedir())

      console.log(realHomeDir)
      const linkedHomeDir = path.resolve(realTempDir, 'fake-home')

      // jest.spyOn(os, 'homedir')
      //   .mockImplementation(() => linkedHomeDir)

      fse.ensureSymlinkSync(tempDir, linkedHomeDir)

      const value = path.resolve(realTempDir, 'some/nested/dir')

      const normalized = normalizePaths(value)
      expect(normalized).toEqual('<HOME_DIR>/some/nested/dir')

    })

  })

})
