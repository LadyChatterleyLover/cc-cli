const downloadGitRepo = require('download-git-repo')
const util = require('util')
const ora = require('ora')
const spinner = ora()
const fs = require('fs-extra')
const chalk = require('chalk')
const exec = require('child_process').execSync
const inquirer = require('inquirer')


const { elementPackage } = require('../template/elementPackage')
const { antdVuePackage } = require('../template/antdVuePackage')
const { mainTemplate } = require('../template/mainTemplate')
const { packageTemplate } = require('../template/package')
const { elementPlusTemplate } = require('../template/elementPlus')
const { antdVueTemplate } = require('../template/antdVue')

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }
  async create(targetDir, answer, template) {
    await this.download(targetDir, answer, template)
  }
  // 下载代码
  async download(targetDir, answer, template) {
    spinner.text = '拉取代码中...'
    spinner.start()
    // 拼接下载路径
    let requestUrl = `LadyChatterleyLover/vite-vue-ts-template#main`
    downloadGitRepo(requestUrl, this.target, (err) => {
      if (err) console.log('err', err)
      else {
        if (answer.ui === 'element-plus') {
          fs.writeFileSync(`${targetDir}/src/main.ts`, elementPlusTemplate())
          let text = `{
            "name": "${this.name}",
            "author": "${answer.author}",
            "version": "${answer.version}",
            ${elementPackage()}
          }`
          let http = require('../template/http')('ElMessage', 'element-plus')
          fs.writeFileSync(`${targetDir}/src/http/index.ts`, http)
          fs.writeFileSync(`${targetDir}/package.json`, text)
        } else if (answer.ui === 'antd vue') {
          fs.writeFileSync(`${targetDir}/src/main.ts`, antdVueTemplate())
          let text = `{
            "name": "${this.name}",
            "author": "${answer.author}",
            "version": "${answer.version}",
            ${antdVuePackage(answer.antdVueVersion)}
          }`
          let http = require('../template/http')('message', 'ant-design-vue')
          fs.writeFileSync(`${targetDir}/src/http/index.ts`, http)
          fs.writeFileSync(`${targetDir}/package.json`, text)
        } else {
          let text = `{
            "name": "${this.name}",
            "author": "${answer.author}",
            "version": "${answer.version}",
            ${packageTemplate()}
          }`
          fs.writeFileSync(`${targetDir}/src/main.ts`, mainTemplate())
          fs.writeFileSync(`${targetDir}/package.json`, text)
        }

        spinner.succeed('创建项目成功')
        console.log()
        spinner.text = '正在安装依赖'
        spinner.start()
        console.log()
        exec(`cd ${this.name} && ${answer.source} i`)
        spinner.succeed('依赖安装成功')
        console.log()
        inquirer.prompt([
          {
            type: "list",
            message: '是否打开vscode',
            name: 'vscode',
            choices: [
              {
                name: '是',
                value: true
              },
              {
                name: '否',
                value: false
              }
            ]
          }
        ]).then(r => {
          if (r.vscode) {
            exec(`cd ${this.name} && code .`)
          }
        })
      }
    })
  }
}

module.exports = Creator