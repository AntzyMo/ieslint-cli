import path from 'node:path'
import * as Diff from 'diff'
import prompts from 'prompts'
import { cwd } from 'node:process'
import { execaCommand } from 'execa'
import { isPackageExists } from 'local-pkg'
import { bold, gray, green, red } from 'kolorist'
import { readFile, readdir, writeFile } from 'node:fs/promises'

import './commander'

function findEslintrc(dir: string[]) {
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
    if (!isPackageExists('@antzy/eslint-config')) await execaCommand('pnpm add @antzy/eslint-config -D', { stdout: 'inherit' })

    const newCode = code.replace(reg, match => {
      const [key] = match.split(':')
      return `${key}: '@antzy'`
    })
    console.log('')
    console.log('We are going to update the eslint config with with the following changes: ')
    console.log('')
    printDiff(code, newCode)
    console.log('')

    const { confirm } = await prompts ({
      type: 'confirm',
      name: 'confirm',
      message: 'Continue?',
      initial: true
    })
    if (!confirm) process.exit()

    await writeFile(eslintFileUrl, newCode)

    console.log('')
    console.log(green('Ok, the configuration is complete'), '\n')
    process.exit()
  } else {
    console.log('')
    console.log('The configuration is complete, no need to configure again')
    console.log('')
  }
}

async function pnpmAddEslint() {
  const eslintConfig = 'module.exports = { extends: \'@antzy\' }'
  try {
    await execaCommand('pnpm add eslint @antzy/eslint-config -D', { stdout: 'inherit' })
    const eslintFileUrl = path.join(cwd(), '.eslintrc.cjs')
    await writeFile(eslintFileUrl, eslintConfig)

    console.log('')
    console.log(green(`+ 1  | ${eslintConfig}\n`))
    console.log('The above configuration has been added to:', bold(green('.eslintrc.cjs')))
    console.log('')
  } catch {
    process.exit()
  }
}

function printDiff(form: string, to: string) {
  const diffs = Diff.diffLines(form, to)
  let no = 0
  let output = ''

  for (const diff of diffs) {
    let lines = diff.value.trimEnd().split('\n')
    if (!('added' in diff)) {
      if (lines.length > 3) {
        no = diff.count - 3
        lines = lines.slice(-3)
      }
    }

    for (const line of lines) {
      if (!diff.added) no += 1
      if (diff.added) {
        output += green(`+     | ${line}\n`)
      } else if (diff.removed) {
        output += red(`- ${no.toString().padStart(3, ' ')} | ${line}\n`)
      } else {
        output += gray(`  ${no.toString().padStart(3, ' ')} | ${line}\n`)
      }
    }
  }

  console.log(output.trimEnd())
}

// TODO: 以后可能会增加的选项 在原有的 extends 里面增加 @antzy
function unshiftExtends(match) {
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

