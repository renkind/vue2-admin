## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### 项目编辑器和安装插件

- 项目开发统一采用 Vscode

- Prettier - Code formatter v9.2.0
- ESLint v2.2.2

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 注意

- 在编辑/新增/列表查询,一些字典值无法回显的时候注意看一下是不是数据类型没有匹配，前端转一下字符串或者转一下数字类型

- 分页问题，如果有 11 条数据，2 页，当在第二页只有一条数据并且删除时，分页页面显示的还是 1，但是数据为空。在删除方法逻辑里增加下面逻辑(参考字典管理删除逻辑)

```javascript
const totalPage = Math.ceil((this.total - 1) / this.queryParams.pageSize);
const currentPage = this.queryParams.pageNo > totalPage ? totalPage : this.queryParams.pageNo;
this.queryParams.pageNo = currentPage < 1 ? 1 : currentPage;
```

- 开发说明
  - 列表页面 index
  - 新增/编辑页面公用一个页面 edit
  - 详情单独一个页面 detail
  - 组件首字母大写
