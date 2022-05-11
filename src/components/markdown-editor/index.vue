<template>
  <div class="markdown-editor" :class="isFullScreen && 'active'">
    <div class="tool-bar">
      <div
        @mouseover="hlistShow = true"
        @mouseleave="hlistShow = false"
        class="tool-btn"
      >
        H<i
          class="iconfont icon-down"
          style="display: inline-block; font-size: 5px; transform: scale(0.5)"
        ></i>
        <transition name="fade">
          <div
            @mouseover="hlistShow = true"
            @mouseleave="hlistShow = false"
            v-show="hlistShow"
            class="ul"
          >
            <div
              @click="toHeader(item.value)"
              class="li"
              v-for="item of headers"
              :key="item.code"
            >
              {{ item.code }}
            </div>
          </div>
        </transition>
      </div>
      <div class="tool-btn" @click="toStrong" style="font-weight: bold">B</div>
      <div class="tool-btn" @click="toItalic" style="font-style: italic">I</div>
      <div
        class="tool-btn"
        @click="toLineMiddle"
        style="text-decoration: line-through"
      >
        S
      </div>
      <div class="tool-btn" @click="toBlockQuote">
        <i class="iconfont icon-quoter"></i>
      </div>
      <div class="tool-split-line"></div>
      <div
        @mouseout="tableShow = true"
        @mouseleave="tableShow = false"
        class="tool-btn"
      >
        <i class="iconfont icon-table"></i>
        <transition name="fade">
          <div
            @mouseout="tableShow = true"
            @mouseleave="tableShow = false"
            v-show="tableShow"
            class="table-box"
          >
            <input
              placeholder="行"
              class="text-input"
              type="text"
              style="margin-right: 5px"
              v-model.number="tableRow"
            />-<input
              class="text-input"
              placeholder="列"
              type="text"
              v-model.number="tableCol"
              style="margin-left: 5px"
            />
            <div style="text-align: right">
              <div class="btn btn-save" @click="toTable">确定</div>
            </div>
          </div>
        </transition>
      </div>
      <div class="tool-btn" @click="toList">
        <i class="iconfont icon-list"></i>
      </div>
      <div class="tool-btn" @click="toNumberList">
        <i class="iconfont icon-numberlist"></i>
      </div>
      <div class="tool-btn" @click="toTaskList">
        <i class="iconfont icon-task-list" style="font-weight: bold"></i>
      </div>
      <div class="tool-btn" @click="toLine">
        <i class="iconfont icon-line"></i>
      </div>
      <div class="tool-split-line"></div>
      <div class="tool-btn" @click="toImg">
        <i class="iconfont icon-img"></i>
      </div>
      <div class="tool-btn" @click="toLink">
        <i class="iconfont icon-link"></i>
      </div>
      <div class="tool-btn" @click="toCode">
        <i class="iconfont icon-code"></i>
      </div>
      <div class="tool-split-line" @click="save"></div>
      <div class="tool-btn">
        <i class="iconfont icon-save"></i>
      </div>
      <div style="flex-grow: 1"></div>
      <a
        class="tool-btn"
        href="http://markdown.p2hp.com/basic-syntax/"
        target="_bank"
        style="text-decoration: none"
      >
        <i class="iconfont icon-problem"></i>
      </a>
      <div
        class="tool-btn"
        :class="{ active: isView_ }"
        @click="isView_ = !isView_"
      >
        <i class="iconfont icon-eye"></i>
      </div>
      <div
        class="tool-btn"
        :class="{ active: isLinkage }"
        @click="isLinkage = !isLinkage"
      >
        <i class="iconfont icon-linkage" style="font-weight: bold"></i>
      </div>
      <div class="tool-btn" @click="toggleFullScreen">
        <i v-if="isFullScreen" class="iconfont icon-zoom-out"></i>
        <i v-else class="iconfont icon-zoom-in"></i>
      </div>
    </div>
    <div
      ref="scrollRef"
      class="edit-box"
      @mousemove="_throttle"
      @mouseup="closeDrag"
      @mouseleave="closeDrag"
      :class="{ draging: isDrag }"
    >
      <!-- 防止拖动频闪 -->
      <div v-if="isDrag" class="mask"></div>
      <div class="edit-content" :style="getEditorStyle">
        <textarea
          ref="textareaRef"
          class="editor"
          cols="30"
          rows="10"
          @scroll="editorBoxScroll"
          v-model="content"
        ></textarea>
      </div>
      <div v-if="isView_" class="split-line" @mousedown="openDrag"></div>
      <div
        v-if="isView_"
        class="view-content"
        ref="viewContentRef"
        :style="getContentStyle"
      >
        <markdown-viewer
          :plugins="mdPlugins_"
          :options="mdOptions_"
          :value="content"
        ></markdown-viewer>
      </div>
    </div>
  </div>
</template>
<script>
import { throttle } from "lodash";
import taskList from "markdown-it-task-lists";
import {
  insertInline,
  insertBlock,
  insertContent,
  selectArea,
  lf,
  generateTheme,
} from "./assets/javascript/index.js";
export default {
  props: {
    isView: {
      type: Boolean,
      default: true,
    },
    // 分割线可移动范围
    splitLineRange: {
      type: Array,
      default: () => [10, 90],
    },
    mdPlugins: {
      type: Array,
    },
    mdOptions: {
      type: Object,
    },
    theme: {
      type: Object,
    },
  },
  data() {
    return {
      isFullScreen: false,
      isLinkage: true,
      isView_: true,
      mdPlugins_: [
        {
          plugin: taskList,
        },
      ],
      mdOptions_: {},
      theme_: {
        primaryColor: "#2196f3",
        hoverColor: "#cccccc50",
        activeColor: "#cccccc80",
        lineColor: "#CFD8DC",
        toolbarColor: "#ECEFF1",
        backgroundColor: "#ffffff",
      },
      // 编辑器占比
      editorProportion: 50,
      // 是否可以拖动
      hlistShow: false,
      tableRow: 3,
      tableCol: 3,
      tableShow: false,
      isDrag: false,
      content: "",
      boxWidth: 0,
      headers: [
        { code: "H1", value: "# " },
        { code: "H2", value: "## " },
        { code: "H3", value: "### " },
        { code: "H4", value: "#### " },
        { code: "H5", value: "##### " },
        { code: "H6", value: "###### " },
      ],
    };
  },
  computed: {
    getEditorStyle() {
      return {
        flex: `1 1 auto`,
      };
    },
    getContentStyle() {
      return {
        flex: `0 0 ${100 - this.editorProportion}%`,
      };
    },
  },
  methods: {
    moveLine($event) {
      if (this.isDrag) {
        const [min, max] = this.splitLineRange;
        const val = Math.max(($event.layerX * 100) / this.boxWidth, min);
        this.editorProportion = Math.min(val, max);
      }
    },
    _throttle: throttle(function ($event) {
      this.moveLine($event);
    }, 100),
    closeDrag() {
      this.isDrag = false;
    },
    openDrag() {
      this.isDrag = true;
    },
    editorBoxScroll: throttle(function ($event) {
      this.editorBoxScrollOptimize($event);
    }, 50),
    /**
     * 计算滚动占比值
     */
    editorBoxScrollOptimize($event) {
      if (!this.isLinkage) return;
      // 如果查看器有滚动条才触发滚动联动
      const { scrollHeight: vsh, clientHeight: vch } =
        this.$refs.viewContentRef;
      if (vsh > vch) {
        // 计算滚动比例 scrollTop/(scrollHeight - clientHeight)
        const { clientHeight, scrollHeight, scrollTop } = $event.target;
        const scale = scrollTop / (scrollHeight - clientHeight);
        this.autoScroll(this.$refs.viewContentRef, scale);
      }
    },
    /**
     * 设置联动滚动条高度
     */
    autoScroll(el, scale) {
      const { clientHeight, scrollHeight } = el;
      el.scrollTop = (scrollHeight - clientHeight) * scale;
    },

    // toolbar
    toHeader(insertStr) {
      insertInline(this, this.$refs.textareaRef, [insertStr, null]);
    },
    toStrong() {
      const inserArr = ["**", "**"];
      insertInline(this, this.$refs.textareaRef, inserArr);
    },
    toItalic() {
      const inserArr = ["*", "*"];
      insertInline(this, this.$refs.textareaRef, inserArr);
    },
    toLineMiddle() {
      const inserArr = ["~~", "~~"];
      insertInline(this, this.$refs.textareaRef, inserArr);
    },
    toBlockQuote() {
      const inserStr = ["> ", lf + "> " + lf + "> ", lf];
      insertBlock(this, this.$refs.textareaRef, inserStr);
    },
    toTable() {
      const textarea = this.$refs.textareaRef;
      const content = textarea.value;
      const start = textarea.selectionStart;
      let inserStr = start === 0 ? "" : lf;
      const thStr = "|col";
      const tdStr = "|text";
      const snapStr = "|---";
      const row = this.tableRow;
      const col = this.tableCol;
      for (let i = 1; i <= row; i++) {
        let line = "";
        for (let j = 1; j <= col; j++) {
          if (i === 1) {
            inserStr += thStr;
            line += snapStr;
          } else {
            inserStr += tdStr;
          }
          if (j === col) {
            // 在最后补充 '|\n'
            inserStr += "|" + lf;
            if (i === 1) {
              inserStr += line + "|" + lf;
            }
          }
        }
      }
      this.content = insertContent(content, inserStr, start, false);
    },
    toList() {
      const inserArr = ["- ", lf + "- ", ""];
      insertBlock(this, this.$refs.textareaRef, inserArr);
    },
    toNumberList() {
      const inserArr = ["1. ", lf];
      insertBlock(this, this.$refs.textareaRef, inserArr, true);
    },
    toTaskList() {
      const insertArr = ["- [ ] ", lf + "- [ ] "];
      insertBlock(this, this.$refs.textareaRef, insertArr, false);
    },
    toLine() {
      const insertStr = [
        lf + "-------------------" + lf,
        lf + lf + "-------------------" + lf,
      ];
      insertBlock(this, this.$refs.textareaRef, insertStr);
    },
    toImg() {
      const insertArr = ["![image](", ")" + lf + "![image](", ")"];
      const insertStr = "![image](http://)";
      const textarea = this.$refs.textareaRef;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = textarea.value;
      if (start === end) {
        this.content = insertContent(content, insertStr, start, false);
        const selectIndex = start + insertStr.length - 1;
        selectArea(this, textarea, selectIndex, selectIndex);
      } else {
        insertBlock(this, this.$refs.textareaRef, insertArr);
      }
    },
    toLink() {
      const insertArr = ["[link](", ")" + lf + "[link](", ")"];
      const insertStr = "[link](http://)";
      const textarea = this.$refs.textareaRef;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = textarea.value;
      if (start === end) {
        this.content = insertContent(content, insertStr, start, false);
        const selectIndex = start + insertStr.length - 1;
        selectArea(this, textarea, start + 7, selectIndex);
      } else {
        insertBlock(this, this.$refs.textareaRef, insertArr);
      }
    },
    toCode() {
      const inserArr = ["`", "`"];
      insertInline(this, this.$refs.textareaRef, inserArr);
    },
    save() {
      this.$emit("getContent", this.contents);
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
      this.$nextTick(() => {
        this.setBoxWidth();
      });
    },
    /**
     * 设置分割线的容器的宽度
     */
    setBoxWidth() {
      this.boxWidth = document.querySelector(".edit-box").clientWidth;
    },
    initTheme() {
      const style = document.createElement("style");
      const theme = Object.assign({}, this.theme_, this.theme);
      style.type = "text/css";
      style.id = "markdown-editor";
      style.innerHTML = generateTheme(theme);
      document.head.append(style);
    },
    mergeConfig() {
      Object.assign(this.mdOptions_, this.mdOptions);
      Object.assign(this.mdPlugins_, this.mdPlugins);
    },
  },
  components: {
    MarkdownViewer: () => import("../markdown-viewer/index.vue"),
  },
  created() {
    this.isView_ = this.isView;
  },
  mounted() {
    this.initTheme();
    this.mergeConfig();
    this.setBoxWidth();
    // 监听用户粘贴事件，替换连接和图片内容
    this.$refs.textareaRef.addEventListener("paste", async (event) => {
      const linkReg = /^(http|https):\/\/.*/;
      const textarea = this.$refs.textareaRef;
      const clipboard = event.clipboardData;
      const type = clipboard.items[0].type;
      if (type.match(/image/)) {
        // 处理图片
        var blob = clipboard.items[0].getAsFile();
        var file = new FileReader();
        file.addEventListener("loadend", (e) => {
          textarea.selectionEnd = textarea.selectionStart;
          textarea.selectionStart = textarea.selectionStart - blob.name.length;
          this.content = this.content.slice(0, textarea.selectionStart);
          this.content = this.content + "![image](" + e.target.result + ")";
        });
        file.readAsDataURL(blob);
      } else {
        // 处理链接
        const pasteText = await navigator.clipboard.readText();
        textarea.selectionEnd = textarea.selectionStart;
        textarea.selectionStart = textarea.selectionStart - pasteText.length;
        if (linkReg.test(pasteText)) {
          if (linkReg.test(pasteText)) {
            insertInline(this, this.$refs.textareaRef, ["[link](", ")"]);
          }
        }
      }
      event.preventDefault();
    });
  },
};
</script>
<style lang="css" scoped>
@import "assets/css/iconfont/iconfont.css";
.markdown-editor {
  position: relative;
  font-size: 15px;
  height: 100%;
  border: 1px solid var(--line-color);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background-color: var(--background-color);
  transition: top, bottom, left, right 0.5s ease-out;
}
.markdown-editor.active {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.tool-bar {
  padding: 3px;
  height: 40px;
  z-index: 10;
  display: flex;
  align-items: center;
  background-color: var(--toolbar-color);
  border-bottom: 1px solid var(--line-color);
}
.tool-split-line {
  margin: 5px 5px;
  width: 1px;
  background-color: #cccccc80;
  height: 20px;
}
.edit-box {
  position: relative;
  display: flex;
  user-select: none;
  flex: 1 1 auto;
  height: calc(100% - 50px);
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  cursor: move;
}
.edit-box.draging,
.edit-box.draging textarea {
  cursor: move;
}
.editor {
  padding: 5px;
  width: 100%;
  height: 100%;
  outline: 0;
  resize: none;
  box-sizing: border-box;
  border: 0;
}
.split-line {
  flex: 0 0 2px;
  background-color: #dfd5d550;
  cursor: move;
  margin-left: 3px;
  margin-right: 3px;
  user-select: none;
}
.view-content {
  padding: 5px;
  overflow: auto;
  text-align: left;
}
.tool-btn {
  margin: 3px;
  color: var(--primary-color);
  width: 35px;
  height: 28px;
  line-height: 25px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
}
.tool-btn.active,
.tool-btn:hover {
  background-color: var(--hover-color);
}
.tool-btn:active {
  background-color: var(--active-color);
}
.ul {
  padding: 5px 3px;
  border: 1px solid #cccccc;
  display: inline-block;
  border-radius: 4px;
  background-color: #ffffff;
}
.li {
  padding: 5px 15px;
  cursor: pointer;
}
.li:hover {
  color: var(--primary-color);
  background-color: #eeeeee;
}
.table-box {
  padding: 12px 15px;
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  color: #333333;
}
.btn {
  position: relative;
  background-color: var(--primary-color);
  color: #ffffff;
  display: inline-block;
  padding: 0px 8px;
  border-radius: 4px;
  font-size: 13px;
}
.table-box .btn {
  margin-top: 15px;
}
.btn:active:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: rgba(50, 50, 50, 0.05);
  content: "";
  display: block;
}
.text-input {
  padding: 0 3px;
  border: 1px solid #999999;
  border-radius: 2px;
  height: 25px;
  font-size: 13px;
}
.table-box .text-input {
  width: 50px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>