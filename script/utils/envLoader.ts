import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parse } from 'toml'

import Type from '../type/env'

export interface EnvLoaderParam {
  focus?: boolean
}

export const ROOT = process.cwd()

const defaultConf = {
  mode: process.env.NODE_ENV as Type.env['mode'] || 'production'
}
let conf: Type.env

function loadENVFile () {
  conf = defaultConf
  const filePath = resolve(ROOT, './env.toml')
  let fileContent: string
  try {
    fileContent = readFileSync(
      filePath,
      {
        encoding: 'utf8',
        flag: 'r'
      }
    )

  } catch (e) {
    /** 配置文件不存在，使用缺省值 */
  }

  const tomlContent = parse(fileContent)
  for (const key of Object.keys(tomlContent)) {
    if (tomlContent[key] !== undefined) {
      conf[key] = tomlContent[key]
      process.env[key] = tomlContent[key]
    }
  }
}

export default function ({ focus = false }: EnvLoaderParam = {} ) {
  if (!conf || focus) {
    loadENVFile()
  }

  return conf
}
