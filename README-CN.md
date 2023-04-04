<p align=center>
<a href="https://github.com/AntzyMo/iEslint-cli"><img src="./assets/logo.svg"/></a>
</p>

<p align="center">
    <br> <a href="https://github.com/AntzyMo/iEslint-cli">English</a> | 中文
</p>


## 背景介绍
为什么我要写这个插件？  
因为想要偷懒，在创建一个新的`vue`项目时我需要的步骤：  
1. `pnpm create vue@latest`
2. `pnpm add eslint @antzy/eslint-config -D` (因为我有自己的`eslint`配置，所以不用`vue`的内置的`eslint`配置)
3. 新建`.eslintrc.cjs`
4. 在`.eslintrc.cjs`里面写上`module.exports = { extends: '@antzy' }`  

以上，我从第二步开始就觉得很繁琐，比`vue`还要长的命令，我打累了，于是就开始从这里简化，把第2、3、4步合并成一个包，从此诞生了`ieslint`


## Installation
```
pnpm i @antzy/ieslint -g
```

## Usage
```shell
ieslint
```
or

```shell
npx  @antzy/ieslint
```

## License
[MIT](./LICENSE) License &copy; 2023-PRESENT [AntzyMo](https://github.com/AntzyMo)



