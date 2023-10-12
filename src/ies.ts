import path from 'node:path'
import { execaCommand } from 'execa'
import { bold, green } from 'kolorist'
import { isPackageExists } from 'local-pkg'
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

  let importAntzyESlintConfig = ''
  if (pkgInfo.includes('"type": "module"')) {
    importAntzyESlintConfig = "import { antzy } from '@antzy/eslint-config'"
  } else {
    importAntzyESlintConfig = "const { antzy } = require('@antzy/eslint-config')"
  }

  const eslintConfigTemplate = `
  ${importAntzyESlintConfig}\n\nexport default antzy()
`

  const eslintFileUrl = path.join(process.cwd(), 'eslint.config.js')
  await writeFile(eslintFileUrl, eslintConfigTemplate.trim()).catch(() => process.exit())

  console.log('')
  console.log(green(`+  1 | ${importAntzyESlintConfig}`))
  console.log(green(`+  2 | export deafult antzy()\n`))

  console.log('The above configuration has been added to:', bold(green('eslint.config.js')))
  console.log('')
}
