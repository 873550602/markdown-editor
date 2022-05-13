<template>
  <div id="app">
    <markdown-editor v-model="content"></markdown-editor>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return {
      content:'# hello'
    }
  },
  components: {
    MarkdownEditor: () => import("@/components/markdown-editor/index.vue"),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 800px;
  padding: 30px 200px;
}
</style>
