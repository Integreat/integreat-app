import 'raf/polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import * as fs from 'fs'
import * as path from 'path'

configure({
  adapter: new Adapter()
})
// Setup fetch mock
global.fetch = require('jest-fetch-mock')
// Setup config mock

function walkDir(dir: string, callback: (dir: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const filePath = path.join(dir, f)
    const isDirectory = fs.statSync(filePath).isDirectory()
    isDirectory ? walkDir(filePath, callback) : callback(filePath)
  })
}

// The following code automatically unmocks the modules in `mocksPath`. This is required because jest mocks all these
// modules automatically as soon as they are found
const mocksPath = 'src/__mocks__/'
const mockPathEndings = ['.ts', '.tsx'] // This only unmocks .ts and .tsx files not .json for example
walkDir(mocksPath, name => {
  mockPathEndings.forEach(ending => {
    if (name.endsWith(ending)) {
      jest.unmock(name.substring(mocksPath.length, name.length - ending.length))
    }
  })
})
