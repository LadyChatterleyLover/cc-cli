const exec = require('child_process').execSync
const inquirer = require('inquirer')
const ora = require('ora')
const spinner = ora()
const chalk = require('chalk')

module.exports = () => {
  inquirer.prompt([
    {
      type: 'input',
      message: '请输入安装的插件名,如安装多个请用空格分隔',
      name: 'lib',
      validate: (val => {
        if (!val) {
          console.log(chalk.red('插件名不能为空,请重新输入'))
        } else {
          return true
        }
      })
    },
    {
      type: 'list',
      name: 'method',
      message: '请选择安装源',
      choices: ['cnpm', 'npm']
    },
    {
      type: 'list',
      name: 'isPro',
      message: '请选择安装源',
      choices: [
        { name: '生产', value: '-S' },
        { name: '开发', value: '-D' }
      ]
    }
  ]).then(answers => {
    let cmd = `${answers.method} i ${answers.lib} ${answers.isPro}`
    spinner.text = `正在执行 ${cmd}`
    spinner.start()
    let res = exec(cmd)
    if (res) {
      spinner.succeed('安装成功')
    } else {
      spinner.fail('安装失败')
    }
  })
}