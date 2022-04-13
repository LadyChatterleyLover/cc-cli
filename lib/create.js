const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const ora = require('ora')
const Creator = require('./Creator')
const spinner = ora()

module.exports = async function (projectName, options) {
  // 当前输入命令行的路径
  let cwd = process.cwd()
  // 目标文件夹
  let targetDir = path.join(cwd, projectName)
  // 如果已经有该文件夹
  if (fs.existsSync(targetDir)) {
    // 如果强制创建就删掉原文件夹
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      // 提示用户是否确定要覆盖文件夹
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '当前目录已经存在',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite'
            },
            {
              name: '取消',
              value: 'cancel'
            }
          ]
        }
      ])
      if (action === 'cancel') return
      else {
        spinner.text = '正在删除中...'
        spinner.start()
        await fs.removeSync(targetDir)
        setTimeout(() => {
          spinner.stop()
          // 创建项目
          const creator = new Creator(projectName, targetDir)
          inquirer.prompt([
            {
              type: 'list',
              message: '请选择安装源',
              name: 'source',
              choices: ['npm', 'cnpm']
            },
            {
              type: 'input',
              message: '请输入作者名',
              name: 'author',
              default: ''
            },
            {
              type: 'input',
              message: '请输入版本号',
              name: 'version',
              default: '1.0.0'
            },
            {
              type: 'list',
              message: '请选择ui框架',
              name: 'ui',
              choices: ['element-plus', 'antd vue', '无']
            }
          ]).then(answer => {
            if (answer.ui === 'antd vue') {
              inquirer.prompt([
                {
                  type: 'list',
                  message: '请选择版本',
                  name: 'antdVueVersion',
                  choices: [
                    { name: '1.x', value: '1.7.8' },
                    { name: '2.x', value: '2.2.8' },
                    { name: '3.x', value: '3.0.0-alpha.7' },
                  ]
                }
              ]).then(r => {
                console.log(r)
                answer.antdVueVersion = r.antdVueVersion
                creator.create(targetDir, answer)
              })
            } else {
              creator.create(targetDir, answer)
            }
          })
        }, 800)
      }
    }
  } else {
    // 创建项目
    const creator = new Creator(projectName, targetDir)
    inquirer.prompt([
      {
        type: 'list',
        message: '请选择安装源',
        name: 'source',
        choices: ['npm', 'cnpm']
      },
      {
        type: 'input',
        message: '请输入作者名',
        name: 'author',
        default: ''
      },
      {
        type: 'input',
        message: '请输入版本号',
        name: 'version',
        default: '1.0.0'
      },
      {
        type: 'list',
        message: '请选择ui框架',
        name: 'ui',
        choices: ['element-plus', 'antd vue', '无']
      }
    ]).then(answer => {
      if (answer.ui === 'antd vue') {
        inquirer.prompt([
          {
            type: 'list',
            message: '请选择版本',
            name: 'antdVueVersion',
            choices: [
              { name: '1.x', value: '1.7.8' },
              { name: '2.x', value: '2.2.8' },
              { name: '3.x', value: '3.0.0-alpha.7' },
            ]
          }
        ]).then(r => {
          answer.antdVueVersion = r.antdVueVersion
          creator.create(targetDir, answer)
        })
      } else {
        creator.create(targetDir, answer)
      }
    })
  }
}