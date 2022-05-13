# markdown-editor

<img width="1462" alt="image" src="https://user-images.githubusercontent.com/35795645/167868438-7cefd3c5-5b71-40c9-86cc-41fafd90fd6b.png">

## 安装
```
yarn add md-simple-editor --save
// or
npm install md-simple-editor --save
```

### 使用
```
import {MarkdownViewer},MarkdownEditor from "md-simple-editor"
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
|v-model|string|无|双向绑定|
|placeholder|string|无|提示信息|
|isView|boolean|true|是否开启查看器|
|splitLineRange|array|[10,90]|设置编辑器和查看器的分割线的移动范围|
|theme|Object|{primaryColor: "#2196f3",hoverColor: "#cccccc50",activeColor: "#cccccc80",lineColor: "#CFD8DC",toolbarColor: "#ECEFF1",backgroundColor: "#ffffff"}|设置主题颜色|
|mdPlugins|array|[]|参考markdown-it插件使用|
|mdOptions|object|{}|参考markdown-it配置|
      
