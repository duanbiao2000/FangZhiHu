const _ = require('lodash');

exports.setCookies = (ctx, info) => {
  if (!_.isObject(info)) {
    return false;
  }
  _.forIn(info, (value, key) => {
    ctx.cookies.set(key, encodeURIComponent(value), {
      domain: 'localhost',
      path: '/',
      maxAge: 24*60*60*1000,
      httpOnly: false,
      overwrite: false
    });
  });
}

exports.destroyCookies = (ctx, info) => {
  if (!_.isObject(info)) {
    return false;
  }
  _.forIn(info, (value, key) => {  //遍历info对象
    ctx.cookies.set(key, value, { //为info对象中的每个键值对设置一个HTTP Cookie
      maxAge: -1 //options对象包含一个maxAge属性,其值为-1
    });
  })
}

exports.catchError = (ctx, err) => {
  console.log(err);
  ctx.resError = err;
}

//增,删Cookies和错误捕获方法