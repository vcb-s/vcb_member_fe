import * as chalk from 'chalk'

export const log = (...args: any[]) => {
  console.log(chalk.green(...args))
}
export const warn = (...args: any[]) => {
  console.warn(chalk.yellow(...args))
}
export const error = (...args: any[]) => {
  console.log(chalk.red(...args))
}

export default {
  log,
  warn,
  error
}
