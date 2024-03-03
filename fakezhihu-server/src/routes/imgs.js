const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const moment = require('moment');  //引入moment插件
//fs用来对文件进行读写操作；path用来获取当前文件的绝对路径，保证图片的存储位置；CryptoJS用来给图片命名，保证不会出现重名图片相互覆盖的问题。

const upload = async (ctx, next) => {
  const file = ctx.request.files.file;  //获取上传文件
  const hash = CryptoJS.MD5(`${file.path}_${moment()}`);
  const reader = fs.createReadStream(file.path); //创建可读流
  let filePath = path.join(__dirname, '../../public/images/upload') + `/${hash}.${file.name.split('.').pop()}`;
  const upStream = fs.createWriteStream(filePath);
  reader.pipe(upStream); //可读流通过管道写入可写流
  ctx.body = {
    // 201(已创建)请求成功并且服务器创建了新的资源
    status: 201,
    url: filePath,
    fileName: `${hash}.${file.name.split('.').pop()}`
  };
};

module.exports = {
  "POST /imgs/upload": upload  //暴露接口
}
