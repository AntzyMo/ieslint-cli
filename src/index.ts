#!/usr/bin/env node

import path from 'node:path'
import { green } from 'kolorist'
import { cwd } from 'node:process'
import { execaCommand } from 'execa'

import './commander'
import { readFile, readdir, writeFile } from 'node:fs/promises'

const findEslintrc = (dir: string[]) => {
  const eslintFile = dir.find(fileName => fileName.includes('.eslintrc'))
  return eslintFile
}

const res = await readdir(cwd())
const fileEslintName = findEslintrc(res)

if (fileEslintName) {
  resetEslintExtends()
} else {
  pnpmAddEslint()
}

async function resetEslintExtends() {
  const eslintFileUrl = path.join(cwd(), fileEslintName)
  const code = await readFile(eslintFileUrl, 'utf-8')
  const reg = /extends\s*:\s*(?:(?:'|")[^'"]*(?:'|"))|extends\s*:\s*\[[^[\]]*\]/
  const [extendsValue] = code.match(reg)

  if (!extendsValue.includes('@antzy')) {
    await execaCommand('pnpm add @antzy/eslint-config -D', { stdout: 'inherit' })

    const newCode = code.replace(reg, match => {
      const [key] = match.split(':')
      return `${key}: '@antzy'`
    })

    await writeFile(eslintFileUrl, newCode)
    console.log('\n', green('✅  eslintConfig success'), '\n')
    process.exit()
  }
}

async function pnpmAddEslint() {
  const eslintConfig = 'module.exports = { extends: \'@antzy\' }'
  try {
    await execaCommand('pnpm add eslint @antzy/eslint-config -D', { stdout: 'inherit' })
    const eslintFileUrl = path.join(cwd(), '.eslintrc.cjs')
    writeFile(eslintFileUrl, eslintConfig)
    console.log('\n', green('✅  eslintConfig success'), '\n')
  } catch {
    process.exit()
  }
}

// TODO: 以后可能会增加的选项 在原有的 extends 里面增加 @antzy
const unshiftExtends = match => {
  const [key, rest] = match.split(':')

  // json格式必须要双引号
  const parseRest = JSON.parse(rest.replace(/'/g, '"'))

  if (typeof parseRest === 'string') {
    return `${key}: '@antzy'`
  } else {
    parseRest.unshift('@antzy')
    return `${key}: ${JSON.stringify(parseRest).replace(/"/g, '\'')}`
  }
}
