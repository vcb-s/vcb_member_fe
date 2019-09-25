import { readFileSync, statSync, futimesSync } from 'fs'
import { resolve } from 'path'
import { parse } from 'toml'

import Type from '../type/env'
import console from './console'

const defaultConf = {
  mode: process.env.NODE_ENV as Type.env['mode']
}
let conf: Type.env

function loadENVFile () {
  conf = defaultConf
  const filePath = resolve(process.cwd(), './env.toml')
  let fileContent
  try {
    fileContent = readFileSync(
      filePath,
      {
        encoding: 'utf8',
        flag: 'r'
      }
    )
  } catch (e) {
    console.warn('配置文件不存在，使用缺省值')
  }

  for (const key of Object.keys(parse(fileContent))) {
    if (fileContent[key] !== undefined) {
      conf[key] = fileContent[key]
    }
  }
}

export default function ({ focus = false }: Type.envLoaderParam = {} ) {
  if (!conf || focus) {
    loadENVFile()
  }

  return conf
}

export const ROOT = process.cwd()
