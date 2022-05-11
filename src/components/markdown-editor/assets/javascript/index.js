export const lf = "\n";
/**
 * 插入行内容
 * @params {insertStr} 插入字符串
 */
export const insertInline = (vm, textarea, inserArr) => {
  const l1 = inserArr[0].length;
  const deftext = "content";
  const content = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  if (start === end) {
    vm.content = insertContent(content, inserArr.join(deftext), start, false);
    selectArea(vm, textarea, start + l1, start + deftext.length + l1);
  } else {
    vm.content = insertContent(content, inserArr, start, end);
    selectArea(vm, textarea, start + l1, end + l1);
  }
};
/**
 * 插入start的一边，并且要考虑选区内容
 * @params {insertArr} 插入字符串 0,初始片段，1，循环片段，2补充片段
 * @params {increment} 自增数字
 */
export const insertBlock = (vm, textarea, insertArr, increment = false) => {
  // 如果是数组，说明行后面有补充内容，比如换行
  let [insertStr1, insertStr2] = insertArr;
  const content = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  if (start === end) {
    let frag1 = content.slice(0, start);
    let frag2 = content.slice(start);
    const index1 = content.slice(0, start).lastIndexOf(lf) + 1;

    const newlineIndex = content.slice(start).indexOf(lf);
    const index2 = newlineIndex === -1 ? content.length : start + newlineIndex;

    if (increment === true) insertStr1 = "1. ";
    const insert1 = frag1.lastIndexOf(lf) + 1;
    frag1 = insertContent(frag1, insertStr1, insert1, false);
    if (insertStr2) {
      const lastLfindex = insertStr2.lastIndexOf(lf) + 1;
      frag2 = frag2.replace(lf, insertStr2.slice(0, lastLfindex));
    }
    vm.content = frag1 + frag2;
    selectArea(
      vm,
      textarea,
      index1 + insertStr1.length,
      index2 + insertStr1.length
    );
  } else {
    // 按start,end分三个片段处理
    vm.content = replaceWithfragment(content, insertArr, start, end, increment);
  }
};
/**
 * 选中选区
 * @params {el} dom元素
 * @params {start} 开始索引
 * @params {start} 结束索引
 */
export const selectArea = (vm, el, start, end) => {
  vm.$nextTick(() => {
    el.selectionStart = start;
    el.selectionEnd = end;
    el.focus();
  });
};
/**
 * 插入内容
 * @params {content} 原始内容
 * @params {insert} 插入内容 如果insert是数组，表示开始结束的插入字符不一样
 * @params {start} 开始指针 当是false时表示不插入
 * @params {end} 结束指针
 */
export const insertContent = (content, insert, start, end) => {
  const isarr = Array.isArray(insert);
  const contentList = content.split("");
  const insertStartStr = isarr ? insert[0] : insert;
  const insertEndStr = isarr ? insert[1] : insert;
  if (start !== false) {
    contentList.splice(start, 0, insertStartStr);
  }
  if (end !== false) {
    end += 1;
    contentList.splice(end, 0, insertEndStr);
  }
  return contentList.join("");
};
/**
 * 按开始和结束分三个片段处理，第一个片段最后一个换行字符后插入定义字符，开始到结束的内容替换'\n' -> '\n{自定义字符}'
 * @params {constent} 原始内容
 * @params {start} 开始索引
 * @params {end} 结束索引
 *  @params {insertArr} 插入字符串 0,初始片段，1，循环片段，2补充片段
 * @params {increment} 自增数字
 */
export const replaceWithfragment = (
  content,
  inserArr,
  start,
  end,
  increment = false
) => {
  const [insertStr0, insertStr1, inserStr3] = inserArr;
  let frag1 = content.slice(0, start);
  let frag2 = content.slice(start, end);
  let frag3 = content.slice(end);
  let num = 1;
  const numReg = /\n(?!\d+\.)/;
  if (increment === true) {
    if (start === 0) {
      frag1 = num + ". ";
      num++;
    } else {
      if (!frag1.includes(lf)) {
        frag1 = num + ". " + frag1;
        num++;
      } else {
        const i = frag1.lastIndexOf(lf) + 1;
        frag1 = insertContent(frag1, num + ". ", i, false);
        num++;
      }
    }
    const length = frag2.split(lf).length - 1;
    for (let i = 0; i < length; i++) {
      frag2 = frag2.replace(numReg, lf + num + ". ");
      num++;
    }
  } else {
    if (start === 0) {
      frag1 = insertStr0;
    } else {
      if (!frag1.includes(lf)) {
        frag1 = insertStr0 + frag1;
      } else {
        const i = frag1.lastIndexOf(lf) + 1;
        frag1 = insertContent(frag1, insertStr0, i, false);
      }
    }
    if (frag2.includes(lf)) {
      frag2 = frag2.replaceAll(lf, insertStr1);
    }
  }
  if (frag3.includes(lf)) {
    frag3 = frag3.replace(lf, inserStr3 + lf);
  } else {
    frag3 = frag3 + inserStr3;
  }
  return frag1 + frag2 + frag3;
};

export const generateTheme = (theme) => {
  return `
     .markdown-editor {
   --primary-color: ${theme.primaryColor};
   --hover-color: ${theme.hoverColor};
   --active-color: ${theme.activeColor};
   --line-color: ${theme.lineColor};
   --toolbar-color: ${theme.toolbarColor};
   --background-color: ${theme.backgroundColor};
 }
     `;
};
