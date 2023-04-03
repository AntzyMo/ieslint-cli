<p align="center">
    <br> English | <a href="README-CN.md">中文</a>
</p>


## Background
Why am I writing this plugin?
Because I want to be lazy. When creating a new vue project, the steps I need are:

1. pnpm create vue@latest  
2. pnpm add eslint @antzy/eslint-config -D (because I have my own eslint configuration, I don't need to use the built-in eslint configuration of vue)  
3. Create .eslintrc.cjs  
4. Write module.exports = { extends: '@antzy' } in .eslintrc.cjs  

Starting from step 2, I feel it's cumbersome, with commands longer than vue. I got tired of typing, so I started to simplify it from here and combined steps 2-4 into one package, which gave birth to ieslint.



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




