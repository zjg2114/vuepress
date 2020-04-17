# NPM

npm作为JS包管理工具被前端广泛使用,也是Node.js默认的包管理工具:

1. 允许用户从NPM服务器下载别人编写的第三方包到本地使用。
2. 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

## install流程

我们执行 npm install 后，依赖包被安装到了 node_modules 那么具体机制是什么？
发出npm install命令
npm 向 registry 查询模块压缩包的网址
下载压缩包，存放在~/.npm目录
解压压缩包到当前项目的node_modules目录

### 早期版本

npm 处理依赖的方式简单粗暴，以递归的形式，严格按照 package.json 结构以及子依赖包的 package.json 结构将依赖安装到他们各自的 node_modules 中。直到有子依赖包不在依赖其他模块。

这样的方式优点很明显， node_modules 的结构和 package.json 结构一一对应，层级结构明显，并且保证了每次安装目录结构都是相同的。
如果你依赖的模块非常之多，你的 node_modules 将非常庞大，嵌套层级非常之深：在不同层级的依赖中，可能引用了同一个模块，导致大量冗余。

### NPM3版本

而npm3为了改进嵌套过多、套路过深的情况，会将所有依赖放在第二层依赖中（所有依赖只嵌套一次，彼此平行，也就是平铺的结构）目录层级真正扁平化 依赖同一个包的不同版本时，还是要嵌套


### npm5

默认package-lock.json 锁定版本

默认安装到dependencies

tip：5.0版本存在一个坑：如果已经有package-lock，在package中新增依赖，该包并不会被安装到node_modules，package-lock也不会更新

## 查找

对应的，如果我们在项目代码中引用了一个模块，模块查找流程如下：
在当前模块路径下搜索
在当前模块 node_modules 路径下搜素
在上级模块的 node_modules 路径下搜索
直到搜索到全局路径中的 node_modules
