<template>
  <header class="editor-header">
    <router-link class="m-r-20 logo-wrapper" :to="{ name: 'home' }">
      <img class="logo" src="./../assets/imgs/logo.png" alt="" />
    </router-link>
    <div class="header-content">
      <span class="title">写文章</span>
    </div>
    <div class="functions">
      <el-dropdown class="publish m-r-25" placement="bottom">
        <el-button
          type="primary"
          plain
          size="small"
          @click="$emit('release-articles')"
        >
          发布<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>测试内容</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="more m-r-25" placement="bottom-end">
        <i class="el-icon-more-outline"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>草稿</el-dropdown-item>
          <el-dropdown-item>我的文章</el-dropdown-item>
          <el-dropdown-item>专栏 • 发现</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import request from "@/service";

export default {
  data() {
    return {
      name: "",
      isLogin: false
    };
  },
  //mounted 是一个生命周期钩子，它在组件挂载到 DOM 后被调用。在这个生命周期钩子中，调用了 checkLogin 方法，这是一个异步方法，用于检查用户是否已经登录。
  mounted() {
    this.checkLogin(); //检查是否登录
  },
  methods: {
    async checkLogin() {
      await request.get("/users/checkLogin").then(res => {
        if (res.status === 200) {
          this.name = res.data.name;
          this.isLogin = true;
        } else {
          this.$router.push({ name: "signup" });
          this.isLogin = false;
        }
      });
    }
  }
};
</script>

<style></style>
