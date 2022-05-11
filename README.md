# markdown-editor

## 安装
```
yarn add markdown-editor --save
// or
npm install editor --save
```

### 使用
```
import {MarkdownViewer},MarkdownEditor from "markdown-editor"
import emoji from 'markdown-it-emoji'

const plugins = [{
  plugin:emoji,
  option:{}
}]
<template>
...
<markdown-editor :mdOptions="{html:true}" :mdPlugins="plugins"></markdown-editor>
<markdown-viewer :value="# hello world"></markdown-viewer>
...
</template>
```

### markdownEditor props

|Name|Type|Default|Description|
|---|---|---|---|
|isView|boolean|true|是否开启查看器|
|splitLineRange|array|[10,90]|设置编辑器和查看器的分割线的移动范围|
|theme|Object|{primaryColor: "#2196f3",hoverColor: "#cccccc50",activeColor: "#cccccc80",lineColor: "#CFD8DC",toolbarColor: "#ECEFF1",backgroundColor: "#ffffff"}|设置主题颜色|
|mdPlugins|array|[]|参考markdown-it插件使用|
|mdOptions|object|{}|参考markdown-it配置|
      
