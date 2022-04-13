#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')


program
  .command('init <projectName>')
  .description('创建一个新的项目')
  .option('-f, --force', '如果目标目录存在则强制覆盖')
  .action((name, cmd) => {
    require('../lib/create')(name, cmd)
  })

program
  .command('component')
  .description('创建一个组件')
  .alias('com')
  .action(() => {
    require('../lib/createComponent')()
  })

program.command('file')
  .description('创建一个文件')
  .alias('f')
  .action(() => {
    require('../lib/createFile')()
  })

program.command('install')
  .description('安装插件')
  .alias('i')
  .action(() => {
    require('../lib/install')()
  })

program.command('uninstall')
  .description('卸载插件')
  .alias('uni')
  .action(() => {
    require('../lib/uninstall')()
  })
program.command('statistics')
  .description('统计字符总数')
  .alias('sta')
  .action(() => {
    require('../lib/statistics')()
  })

program.on('--help', () => {
  console.log(`输入 ${chalk.cyan('cc-cli <command>')} -h 查看单个命令详情 `)
})
program.version(require('../package.json').version).parse(process.argv)