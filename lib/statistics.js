const fs = require('fs-extra')
const chalk = require('chalk')
const join = require('path').join
const cwd = process.cwd()

let excludesFiles = ['.DS_Store', '.gitignore', 'node_modules', 'package.json', 'package-lock.json', '.git', '.vscode']


function getJsonFiles(jsonPath) {
  let jsonFiles = []
  function findJsonFile(path) {
    let files = fs.readdirSync(path)
    files.forEach((item) => {
      if (excludesFiles.includes(item)) return
      let fPath = join(path, item)
      let stat = fs.statSync(fPath)
      if (stat.isDirectory() === true) {
        findJsonFile(fPath)
      }
      if (stat.isFile() === true) {
        jsonFiles.push(fPath)
      }
    })
  }
  findJsonFile(jsonPath)
  return jsonFiles
}


module.exports = () => {
  let files = getJsonFiles(cwd)
  let count = 0
  files.map(item => {
    let text = fs.readFileSync(item)
    count += text.length
  })
  console.log(`该项目总共有 ${chalk.red(count)} 个字符, 大约有 ${chalk.red(Math.round(count / 25))} 行代码`)
}