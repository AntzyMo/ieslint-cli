import path from 'node:path'
import * as Diff from 'diff'
import { execaCommand } from 'execa'
import { isPackageExists } from 'local-pkg'
import { bold, gray, green, red } from 'kolorist'
import { readFile, readdir, writeFile } from 'node:fs/promises'

export async function setupEslintConfig() {
  await pnpmInstall(['eslint', '@antzy/eslint-config'])

  // 读取根目录下的文件
  const rootDir = await readdir(process.cwd())

  if (!findEslintConfig(rootDir)) {
    addEslintConfig()
  } else {
    console.log(bold(green('eslint.config.js')), 'already exists')
    console.log('')
  }
}

function findEslintConfig(dir: string[]) {
  const eslintFile = dir.find(fileName => fileName.startsWith('eslint.config'))
  return eslintFile
}

async function pnpmInstall(modules: string[]) {
  const installModules = modules.filter(module => !isPackageExists(module, { paths: [process.cwd()] })).join(' ')
  if (installModules) return execaCommand(`pnpm add ${installModules} -D`, { stdout: 'inherit' })
}

async function addEslintConfig() {
  const rootPkgPath = path.resolve(process.cwd(), 'package.json')
  const pkgInfo = await readFile(rootPkgPath, { encoding: 'utf8' })

  let eslintConfigTemplate = ''
  if (pkgInfo.includes('"type": "module"')) {
    eslintConfigTemplate = "import { antzy } from '@antzy/eslint-config'\n\nexport default antzy()"
  } else {
    eslintConfigTemplate = "const { antzy } = require('@antzy/eslint-config')\n\nmodule.exports = antzy()"
  }

  const eslintFileUrl = path.join(process.cwd(), 'eslint.config.js')
  await writeFile(eslintFileUrl, eslintConfigTemplate.trim()).catch(() => process.exit())

  console.log('')
  printDiff('', eslintConfigTemplate)

  console.log('The above configuration has been added to:', bold(green('eslint.config.js')))
  console.log('')
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
