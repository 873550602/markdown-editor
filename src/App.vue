<template>
  <div id="app">
    <markdown-editor></markdown-editor>
  </div>
</template>

<script>
export default {
  name: "App",
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
