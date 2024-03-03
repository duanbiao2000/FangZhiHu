const model = require('../models'); //引入model
const { users: User } = model; //解构赋值出User
const _ = require('lodash');
const utils = require('../lib/utils');
const { userAttributes } = require('../config/default');

const list = async (ctx, next) => { //list方法(async)
  try {
    const users = await User.findAll(); //查询语句
    ctx.response.status = 200;
    ctx.response.body = users;
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const createUser = async (ctx, next) => {  //createUser方法
  const { name, pwd, email } = ctx.request.body;  //获取请求参数
  try {
    const infoList = await User.findAll({  //获取所有用户数据
      attributes: ['name', 'email']  //只需用户名和邮箱字段
    });
    const nameList = _.map(infoList, item => item.dataValues.name);//获取所有的用户名
    if (_.includes(nameList, name)) {//用户名重复性校验
      // 203 - 非权威性信息
      ctx.response.status = 203;
      ctx.response.body = {
        msg: '用户名重复，请更换用户名'
      };
      return;
    }
    const uniquedEmailList = _.map(infoList, item => item.dataValues.email);
    if (_.includes(uniquedEmailList, email)) {
      ctx.response.status = 203;
      ctx.response.body = {
        msg: '邮箱已存在，请更换邮箱或者直接登录'
      };
      return ;
    };
    await User.create({
      name, pwd, email
    }).then((res) => {
      ctx.response.status = 201;
      ctx.response.body = res;
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const loginUser = async (ctx, next) => {
  const { name, pwd } = ctx.request.body;
  const where = { name, pwd };
  const attributes = ['name', 'id', 'email']; //定义查询字段
  try {
    await User.findOne({
      where, attributes //查询参数
    }).then((res) => {
      if (res === null) {
        // 206 Partial Content 服务器已经完成了部分用户的GET请求
        ctx.response.status = 206;
        ctx.response.body = { //返回提示信息
          msg: '用户名或者密码不对，请修改后重新登录'
        };
        return ;
      } else {
        utils.setCookies(ctx, res.dataValues);
        ctx.response.status = 200;
        ctx.response.body = res;
      }
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const checkLogin = async (ctx, next) => {
  try {
    if (ctx.cookies.get('id')) {
      await User.findOne({
        where: { id: ctx.cookies.get('id') }, //定义查询条件
        attributes: userAttributes
      }).then((res) => {
        ctx.response.body = {
          status: 200,
          name: res.name,
          avatarUrl: res.avatarUrl
        };
      })
    } else {
      // 202——接受和处理、但处理未完成
      ctx.response.status = 202;
    }
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const logout = async (ctx, next) => {
  const cookies = {  //获取Cookies中所有字段的内容
    id: ctx.cookies.get('id'),
    name: ctx.cookies.get('name'),
    email: ctx.cookies.get('email')
  }
  try {
    utils.destroyCookies(ctx, cookies);
    ctx.response.status = 200;  //返回200
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const getUserInfo = async (ctx, next) => {
  const { userId } = ctx.request.query;
  try {
    await User.findOne({
      where: { id: userId },
      attributes: userAttributes
    }).then((res) => {
      ctx.response.body = {
        status: 200,
        content: res
      };
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

const updateUserInfo = async (ctx, next) => {
  const { id, colName, value } = ctx.request.body;
  try {
    await User.update(
      {[colName]: value},
      { where: {id}}
    ).then((res) => {
      ctx.response.body = {
        status: 201,
        content: res // res 为 [0] 是表示失败
      };
    })
  } catch (error) {
    utils.catchError(ctx, error);
  }
}

module.exports = {
  "GET /users/list": list,  //暴露list方法
  "POST /users/create": createUser,
  "POST /users/login": loginUser,
  "GET /users/checkLogin": checkLogin,
  "POST /users/logout": logout,
  "GET /users": getUserInfo,
  "PUT /users": updateUserInfo
}
