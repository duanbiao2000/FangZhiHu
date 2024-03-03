<template>
  <div class="main-content">
    <div class="list">
      <!-- 包含 router-view -->
      <main-list-wrapper />
    </div>
    <div class="sidebar">
      <main-sidebar /> <!--调用 -->
    </div>
  </div>
</template>

<script>
import MainListWrapper from "@/components/MainListWrapper.vue"; //引入
import MainSidebar from "@/components/MainSidebar.vue";

export default {
  name: "Main",
  components: {
    MainListWrapper, //声明主列表组件
    MainSidebar, //声明侧边栏组件
  }
};
</script>
