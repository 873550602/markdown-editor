<template>
  <div class="markdown-viewer" v-html="htmlContent"></div>
</template>
<script>
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/common";
import "./css/vs.css";
import "./css/markdown-it-custom.css";
let md;
export default {
  props: {
    value: {
      type: String,
    },
    options: {
      type: Object,
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      md: null,
      options_: {
        html: false,
        xhtmlOut: false,
        breaks: false,
        linkify: false,
        highlight: function (str, lang) {
          if (!lang) lang = "js";
          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true })
                  .value +
                "</code></pre>"
              );
            } catch (__) {
              return "";
            }
          }

          return (
            '<pre class="hljs"><code>' +
            md.utils.escapeHtml(str) +
            "</code></pre>"
          );
        },
      },
      plugins_: [],
    };
  },
  computed: {
    htmlContent() {
      return this.md.render(this.value);
    },
  },
  created() {
    const options = Object.assign(this.options_, this.options);
    this.md = md = new MarkdownIt(options);
    const plugins = [...this.plugins_, ...this.plugins];
    plugins.forEach((item) => this.md.use(item.plugin, item.options || {}));
  },
};
</script>
<style scoped>
.markdown-viewer {
  height: 100%;
  user-select: text;
}
</style>
