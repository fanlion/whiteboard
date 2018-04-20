# 白板SDK

## 准备工作

* 1.安装nodejs[传送门](https://nodejs.org/en/)
* 2.设置淘宝镜像(`npm config set registry https://registry.npm.taobao.org`翻墙的话，可以忽略)

## 安装依赖

```shell
npm install
```

## 打包

```shell
npm run build
```

> 发布目录为`dist`

## 开发

```shell
npm run dev
```

> `src`目录下的ts将自动编译到dist中

## 目录结构说明

`dist`为SDK发布目录。`examples`为Demo目录，可在`index.html`中查看所有demo,注意：demo中引用了SDK,请保持目录结构正确。
