<template>
  <el-card class="signup-content">
    <img src="./../assets/imgs/logo.png" alt="" />
    <p class="slogen">FakeZhiHu Project</p>

    <!-- 登录表单 -->
    <div class="register" v-show="nowStatus === 'register'">
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        label-width="0px"
      >
        <el-form-item prop="name" class="no-label">
          <el-input placeholder="请输入用户名" v-model="registerForm.name" />
        </el-form-item>
        <el-form-item prop="email" class="no-label">
          <el-input placeholder="请输入邮箱" v-model="registerForm.email" />
        </el-form-item>
        <el-form-item prop="password" class="no-label">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="registerForm.password"
          />
        </el-form-item>
        <el-form-item prop="passwordEnsure" class="no-label">
          <el-input
            type="password"
            placeholder="请再次输入密码"
            v-model="registerForm.passwordEnsure"
          />
        </el-form-item>
        <el-form-item prop="submit">
          <el-button
            class="submit-btn"
            type="primary"
            @click="submitForm('registerForm')"  
          > <!--按钮绑定事件-->
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer register-footer">
        <span>
          注册即代表同意
          <a href="#">《Fake协议》</a>
          <a href="#">《隐私保护指引》</a>
        </span>
        <a href="#">注册机构号</a>
      </div>
    </div>

    <!-- 登录表单 -->
    <div class="login" v-show="nowStatus === 'login'">
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="0px"
      >
        <el-form-item prop="username" class="no-label">
          <el-input placeholder="手机号或邮箱" v-model="loginForm.username" />
        </el-form-item>
        <el-form-item prop="password" class="no-label">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          />
        </el-form-item>
        <div class="others">
          <span>手机验证登录</span>
          <span>忘记密码？</span>
        </div>
        <el-form-item prop="submit">
          <el-button
            class="submit-btn"
            type="primary"
            @click="submitForm('loginForm')"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer login-footer">
        <span>
          <a href="#">二维码登录</a>
          .
          <a href="#">海外手机登录</a>
          .
          <a href="#">社交账号登录</a>
        </span>
      </div>
    </div>

    <div class="switcher">
      {{ tips[nowStatus].base }}
      <span
        @click="nowStatus = nowStatus === 'register' ? 'login' : 'register'"
      >
        {{ tips[nowStatus].link }}
      </span>
    </div>
  </el-card>
</template>

<script>
import request from "@/service";
import md5 from "md5";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!this.pwdReg.test(value)) {
        callback(
          new Error("用户密码需由数字/大写字母/小写字母/标点符号组成，8位以上")
        );
      } else {
        if (this.registerForm.passwordEnsure !== "") {
          this.$refs.registerForm.validateField("passwordEnsure");
        }
        callback();
      }
    };

    const validatePassEnsure = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    return {
      pwdReg: /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z])(?!.*\n).*$/,
      nowStatus: "login",
      tips: {
        register: {
          base: "已有账号？",
          link: "登录"
        },
        login: {
          base: "没有账号？",
          link: "注册"
        }
      },
      registerForm: {
        name: "",
        email: "",
        password: "",
        passwordEnsure: ""
      },
      registerRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blue" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        passwordEnsure: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePassEnsure, trigger: "blur" }
        ]
      },
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名或邮箱", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    async register() {
      await request
        .post("/users/create", {
          name: this.registerForm.name,
          pwd: md5(this.registerForm.password), //使用md5加密 pwd参数
          email: this.registerForm.email
        })
        .then(res => {
          // 201-已创建
          if (res.status === 201) {
            this.$message.success("注册成功");  //注册成功提示
            this.$router.push({ name: "home" });
          } else {
            this.$message.error(res.data.msg);  //注册失败提示
          }
        });
    },
    async login() {
      await request
        .post("/users/login", {
          name: this.loginForm.username,
          pwd: md5(this.loginForm.password)
        })
        .then(res => {
          if (res.status == 200) {
            this.$message.success("登录成功");
            this.$router.push({ name: "home" });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    submitForm(formName) {  //提交按钮触发方法
      this.$refs[formName].validate(valid => {  //表单数据验证
        if (valid) {
          if (this.nowStatus === "register") {  //当前是注册表单
            this.register();  //调用register方法
          } else {
            this.login();
          }
        } else {
          this.$message.error("error submit!!!");//校验失败提示
          return false;
        }
        return "";
      });
    }
  }
};
</script>
