// 创建单个文件
const vueTemplate = require('../template/vue')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require("fs-extra")

module.exports = () => {
  inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: '请选择组件类型',
      choices: ['路由组件', '一般组件']
    },
    {
      name: 'dirname',
      type: 'input',
      message: '请输入文件夹名称',
    },
    {
      name: 'filename',
      type: 'input',
      message: '请输入组件名称',
      validate: (value) => {
        if (value.length) {
          return true
        } else {
          return '请输入组件名称'
        }
      },
    }
  ])
    .then(answers => {
      let type = answers.type
      let dirname = answers.dirname
      let filename = answers.filename
      let file = ''
      let dir = ''

      if (type === '路由组件') {
        dir = `./src/views/${dirname}`
        file = dirname !== '' ? `./src/views/${dirname}/${filename}.vue` : `./src/views/${filename}.vue`
      } else if (type === '一般组件') {
        dir = `./src/components/${dirname}`
        file = dirname !== '' ? `./src/components/${dirname}/${filename}.vue` : `./src/components/${filename}.vue`
      }
      if (dirname === '') {
        fs.access(file, (err) => {
          if (!err) {
            console.log('创建失败：', chalk.yellow('文件已存在'))
          } else {
            fs.writeFile(file, '', function (err1) {
              if (err1) {
                console.log('创建失败：', chalk.red(err1))
              } else {
                console.log(chalk.green(`创建文件成功！${file} `))
              }
            })
          }
        })
      } else {
        // 检查文件夹是否存在
        fs.access(dir, err => {
          if (!err) {
            inquirer.prompt(
              [
                {
                  name: 'continue',
                  type: 'list',
                  message: '文件夹已经存在,是否在此文件夹继续创建文件',
                  choices: ['继续', '取消']
                }
              ]
            ).then(res => {
              if (res.continue === '继续') {
                // 检验当前文件夹下是否有同名文件
                fs.access(file, (err1) => {
                  if (!err1) {
                    console.log('创建失败：', chalk.yellow('文件已存在'))
                  } else {
                    fs.writeFile(file, vueTemplate(filename), function (err2) {
                      if (err2) {
                        console.log('创建失败：', chalk.red(err2))
                      } else {
                        console.log(chalk.green(`创建文件成功！${file}`))
                      }
                    })
                  }
                })
              } else {
                return false
              }
            })
          } else {
            fs.mkdirSync(dir)
            // 检验当前文件夹下是否有同名文件
            fs.access(file, (err) => {
              if (!err) {
                console.log('创建失败：', chalk.yellow('文件已存在'))
              } else {
                fs.writeFile(file, vueTemplate(filename), function (err) {
                  if (err) {
                    console.log('创建失败：', chalk.red(err))
                  } else {
                    console.log(chalk.green(`创建文件成功！${file}`))
                  }
                })
              }
            })
          }
        })
      }

    })
}