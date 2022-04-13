const exec = require('child_process').execSync
const inquirer = require('inquirer')
const ora = require('ora')
const spinner = ora()
const chalk = require('chalk')

module.exports = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入要卸载的插件名',
      validate: (val => {
        if (!val) {
          console.log(chalk.red('插件名不能为空,请重新输入'))
        } else {
          return true
        }
      })
    }
  ]).then(answer => {
    let cmd = `npm uninstall ${answer.name}`
    spinner.text = `正在执行 ${cmd}`
    spinner.start()
    let res = exec(cmd)
    if (res) {
      spinner.succeed('卸载成功')
    } else {
      spinner.fail('卸载失败')
    }
  })
}