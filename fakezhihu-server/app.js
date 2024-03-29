/**
 * app.js 文件主要提供app的配置
 * bin/www 运行项目
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')

const routes = require('./src/server/routes')

// error handler
onerror(app)

// middlewares
app.use(koaBody({ //npm i koaBody -S 增加后端服务对请求体类型(二进制流)的支持
  multipart: true,
  strict: false,  //如果为ture,不解析get,head,delete请求
  formidable: { //设置上传文件大小最大限制,默认2MB,修改为20MB.
    maxFileSize: 20*1024*1024
  }
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 静态文件模版
app.use(views(__dirname + '/src/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(routes())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

console.log('==============================================================');
console.log(' Fakezhihu-server');
console.log('--------------------------------------------------------------');
console.log(' Start prot : 3000')
console.log(` Up time: ${new Date().toString()}`);
console.log('==============================================================');

module.exports = app
