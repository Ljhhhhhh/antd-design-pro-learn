开始之前，你可以先体验一下这个项目：[在线预览](http://antdpro.cixi518.com/)

源码附在文章末尾, 注意查收。

##  技术栈简介
* `react@16.8.6` ：用于构建用户界面的 MVVM 框架
* `umi@2.8.7`： 可插拔的企业级 react 应用框架
* `dva@2.4.1`： 基于 redux 和 redux-saga 的数据流方案
* `antd@3.21.4`：基于 Ant Design 设计体系的 React UI 组件库
* `Ant Design Pro@v4`：一个企业级中后台前端/设计解决方案
* `Axios@0.19.0`：一个基于 promise 的 HTTP 库
* `UForm@0.3.10`：中后台领域的表单解决方案
* `typescript@3.5.3`：Javascript的超集

## 主要目录结构
```
├── config                       # umi 配置，包含路由，构建等配置
├── src													 # 开发主目录
│   ├── assets                   # 本地静态资源
│   ├── components               # 业务通用组件
│   │   ├── Authorized           # 权限认证
│   │   ├── Exception            # 异常组件
│   │   ├── GlobalHeader         # 全局头部
│   │   ├── HeaderDropdown       # 头部下拉选项
│   │   ├── PageLoading          # 页面加载
│   │   ├── SelectLang           # 语言选择
│   │   └── StandardTable        # 高级表格
│   ├── global.less              # 全局样式
│   ├── global.tsx               # 全局js
│   ├── layouts                  # 页面通用布局组件
│   ├── locales                  # 国际化语言包
│   ├── models                   # 全局model
│   │   ├── account.ts           # 用户相关model
│   │   ├── connect.d.ts         # model相关类型定义
│   ├── pages                    # 页面
│   │   ├── Authorized.tsx       # 权限过滤
│   │   ├── Exception            # 错误页面：404 403 500
│   │   ├── Home                 # 首页
│   │   ├── Product              # 产品列表、产品分类
│   │   ├── Account              # 登录页面
│   │   └── User                 # 用户列表
│   ├── services                 # api接口
│   └── utils                    # 通用方法
```

## 项目简介
做为一个基于`antd-design-pro`和`react hooks`打造的后台管理系统项目，该项目利用了`antd-design-pro`提供的权限认证、配置化路由、页面布局组件、面包屑等功能，完成了登录、首页、产品、用户各模块的开发。此外，由于个人感觉antd提供的表单使用起来让我感觉不是很舒服，由此找到了[UForm](https://uformjs.org/#/MpI2Ij/dNFzFyTb)，使用`UForm`更高效的开发了产品编辑模块。

## 踩过的坑
1.  `antd-design-pro v4`这个版本，官方更加推荐使用区块的方案来添加页面，但是按照区块的时候，我发现等了好久都没有反应，网上冲浪发现有这个问题的人还不少。我最后的解决方案是：直接把pro-block整个仓库下载到本地，然后`umi block add path/to/本地地址 --path=/页面目标地址`，例：`umi block add /Users/void/Documents/www/learn/pro-blocks/ListBasicList  --path=/user/list`。

2. 还是跟区块有关。当我添加一个区块的时候，可以看到添加进来的区块的目录结构是这样的
![block](http://pw6c7a9jx.bkt.clouddn.com/1565762156894.jpg)
从图中可以看到它把utils、services、models、less一股脑儿的添加进去了，有些区块甚至还有自己的components，一开始我觉得就这样也没事，但是添加了几个区块之后，我发现，有些东西这个区块有，那个区块也有，所以我觉得区块好用，但是添加进来后，整理一下目录结构还有很有必要的。

3. 上面我说过，该项目的表单使用了UForm进行开发，在处理事件上，他跟antd的form还是有很大的区别的，UForm中的事件需要在他提供的effects中去处理的，直接在Filed上写例如onChange是没有用的，正确使用方式如下
```
// SchemaForm中监听
<SchemaForm
  effects={($)=>{
    $("onFieldChange").subscribe((fieldState)=>{})
    $("onFormInit").subscribe((formState)=>{})
    $("onFormMount").subscribe((formState)=>{})
    $("onFormReset").subscribe((formState)=>{})
    $("onFormSubmit").subscribe((formState)=>{})
  )}
/>
// Field中监听
<Field
  title="一级分类"
  enum={categoryParentList}
  type="string"
  name="parentCategoryId"
  required
  x-effect={() => {
    return {
      onChange(categoryId: number) {
        getCategoryList(categoryId)
      }
    }
  }}
/>
```

4.  在产品详情中，由于产品信息的分类是两级的，二级分类是根据一级分类的ID去异步获取到的子类目。一开始我使用antd的Cascader进行开发，在添加产品的时候，倒也没有问题，然而，在查看产品详情的时候，却发现Cascader无法满足根据一级分类获取二级分类并添加到指定一级分类children属性中，后面又改用了Select这个组件来重新开发。具体代码如下
```
<FormLayout inline={true}>
  <Field
    title="一级分类"
    enum={categoryParentList}
    type="string"
    name="parentCategoryId"
    required
    x-effect={() => {
      return {
        onChange(categoryId: number) {
          getCategoryList(categoryId)
        }
      }
    }}
   />
   {
    categoryList.length ? (
      <Field
        title="二级分类"
        enum={categoryList}
        type="string"
        name="categoryId"
        required
      />
    ) : null
 }
</FormLayout>
```

5. 在使用typescript写项目的时候，会经常遇到ts的类型报错，如下图：
![ts报错](http://pw6c7a9jx.bkt.clouddn.com/WX20190814-143201.png)
这个时候，我们可以追踪到报错的根源，例如这里的`interface.d.ts(53, 5)`，mac用户option+单击就可以，得到类型定义的正确路径并按如下所示引入到文件中就可以解决问题：
```
import { UploadFile } from 'antd/lib/upload/interface'
const [uploadList, setUploadList] = useState<UploadFile[]>([])
```
## 最后

* 后台接口是[《React16+React-Router4  从零打造企业级电商后台管理系统》](https://coding.imooc.com/class/179.html)课程上线项目提供的，我利用nginx做了代理
* 

* [在线预览](http://antdpro.cixi518.com/)

* [github源码地址](https://github.com/Ljhhhhhh/antd-design-pro-learn) 不要star一下吗😳


[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")