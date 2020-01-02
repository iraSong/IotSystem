# 项目配置
页面配置请查看 vue.config.js

> 默认会加载 'src/pages/' 里面， 注意 js 和 html 文件名相同要相同， 如果需定义页面配置请单独添加

> 新建页面
  vue.config.js 中配置多页面  
  文件夹名称和html名称需相同
  默认会读取 src/pages/【文件夹】/【文件夹】.html

  
  如果需自定义页面配置请在vue.config.js 中添加

# 项目优化

1、构建
npm run dev 本地服务-开发环境
npm run dev-test 本地服务-测试环境
npm run build 构建生产环境（部署生产环境执行该命令）会读取：.env.production 中的环境变量
build-test 构建测试环境 （部署测试环境执行该命令）会读取：.env.test 中的环境变量

# 接口地址

dev: 'http://devdbcenter.qdingnet.com/qdh-cloud-web',
szqa: 'http://qasc.qdingnet.com.sz/qdh-cloud-web',
bjqa: 'https://qasc.qdingnet.com/qdh-cloud-web',
boss: 'https://sc.qdingnet.com/qdh-cloud-web'

# 2019.08.22 优化
> 新建页面
  *.wp.js 为页面默认加载的入口js 文件
  html 文件提取到public/index.html
  页面title 在 title.js 文件里面配置


