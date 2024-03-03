<template>
  <header class="main-header">
    <el-dialog
      title="新的问题"
      :visible.sync="askModelVisible"
      :modal-append-to-body="false"
    >
      <ask-model @change-ask-model-visible="changeAskModelVisible" />
    </el-dialog>
    <div class="header-content">
      <router-link class="m-r-20" :to="{ name: 'home' }">
        <img src="./../assets/imgs/logo.png" alt="" class="logo" />
      </router-link>
      <el-menu
        :default-active="activeIndex"
        class="m-r-20"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">发现</el-menu-item>
        <el-menu-item index="2">话题</el-menu-item>
      </el-menu>
      <el-input
        size="small"
        class="search m-r-10"
        placeholder="请输入内容"
        v-model="keywords"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button size="small" type="primary" @click="askModelVisible = true">
        提问
      </el-button>

      <div class="userInfo" v-if="!isLogin">
        <router-link :to="{ name: 'signup' }">登录</router-link>
      </div>
      <div class="userInfo" v-if="isLogin">
        <i class="el-icon-bell m-r-40 icon-item"></i>
        <i class="el-icon-message m-r-40 icon-item"></i>
        <el-dropdown placeholder="bottom" trigger="click" class="hand-click">
          <span>
            {{ this.name }}
            <img :src="avatarUrl" alt="" class="avatar" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- 若不使用native修饰符，无法获取到组件内部的内容，单击也会因此无效 -->
            <el-dropdown-item @click.native="goToPersonalPage">
              <span class="el el-icon-fakezhihu-person"></span>
              我的主页
            </el-dropdown-item>
            <el-dropdown-item divided>
              <i class="el-icon-setting">设置</i>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div @click="logout">
                <span class="el el-icon-fakezhihu-poweroff"></span>
                退出
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import request from "@/service";
import AskModel from "./AskModel.vue";
import { getCookies } from "@/lib/utils";

export default {
  components: { AskModel },
  data() {
    return {
      activeIndex: "1",
      keywords: "",
      isLogin: false,
      name: "",
      askModelVisible: false,
      avatarUrl: ""
    };
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {
      await request.get("/users/checkLogin").then(res => {
        if (res.status === 200) {
          this.name = res.data.name;  //将响应数据中的 'name' 字段赋给当前对象的 'name' 属性
          this.avatarUrl = res.data.avatarUrl;
          this.isLogin = true;
        } else {
          this.$router.push({ name: "signup" });
          this.isLogin = false;
        }
      });
    },
    async logout() {
      await request.post("/users/logout").then(res => {
        if (res.status === 200) {
          this.$message.success("注销成功");  //尤其是在使用了 Element UI 这样的 UI 库时，this.$message 是一个全局方法，用于在页面上显示消息提示框。这个方法通常用于给用户反馈操作的结果，例如成功、警告或错误信息。
          this.name = "";
          this.avatarUrl = "";
          this.$router.push({ name: "signup" }); //this.$router 是 Vue Router 实例的引用，它提供了多种方法来控制应用的路由。this.$router.push 是其中的一个方法，用于导航到不同的 URL，并且不会保留当前的路由记录，即不会在浏览器的历史记录中留下痕迹。
        } else {
          this.$message.error("注销失败，请稍后再试");
        }
      });
    },
    handleSelect(key) {
      console.log(key);
    },
    goToPersonalPage() {
      this.$router.push(`/people/${getCookies("id")}`);
    },
    changeAskModelVisible(status) {
      this.askModelVisible = status;
    }
  }
};
</script>
