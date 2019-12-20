/**
 * 对模版和数据进行编译
 */

class Compile {
  constructor(el, vm) {
    // Vue中el是可以直接传节点
    this.el = typeof el === 'string' ? document.querySelector(el) : el,
      this.vm = vm

    if (this.el) {
      // 把el所有节点放入
      const fragment = this.nodeToFragment(this.el)
      this.compile(fragment)
      this.el.appendChild(fragment)
    }
  }

  /* 核心方法 */

  // 将DOM节点存入内存中编译
  nodeToFragment(node) {
    const fragment = document.createDocumentFragment()
      // 获取所有子节点(包括文本节点、元素节点)
    let childrens = node.childNodes
    this.toArray(childrens).forEach(element => {
      // 把所有节点都添加到fragment中
      fragment.appendChild(element)
    })
    return fragment
  }

  // 编译文档碎片（内存）
  compile(fragment) {
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach(node => {

      // 节点为元素节点(解析指令)
      if (this.isElementNode(node)) {
        // 解析指令
        this.compileElement(node)
      }

      // 节点为文本节点（解析插值{{}}）
      if (this.isTextNode) {
        // 解析插值
        this.compileText(node)
      }

      // 元素节点是否有子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  // 解析元素节点
  compileElement(node) {
    // 获取所有属性
    const attrs = node.attributes
    this.toArray(attrs).forEach(attr => {
      // 获取属性名
      const attrName = attr.name
        // 获取属性值
      const value = attr.value

      // 判断是否是指令 （v-）
      if (this.isDirective(attrName)) {
        // 提取指令
        const type = attrName.slice(2)

        // 为指令v-text节点内添值
        if (type === 'text') {
          node.innerText = this.vm.$data[value]
        }

        // 为指令v-html节点内添值
        if (type === 'html') {
          node.innerHtml = this.vm.$data[value]
        }

        // 解析v-modle指令
        if(type === 'model'){
          node.value = this.vm.$data[value]
        }

        //解析v-on:Event指令
        if (this.isEventDirective(type)) {
          node.addEventListener(type.split(':')[1],this.vm.$methods[value])
        }
      }
    })
  }

  // 解析文本节点
  compileText(node) {

  }


  /* 工具方法 */

  // 类数组转为数组
  toArray(nodeList) {
    return [].slice.call(nodeList)
  }

  // 是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  // 是否是文本节点
  isTextNode(node) {
    return node.typeNode === 3
  }

  // 是否是v-开头
  isDirective(nodeName) {
    return nodeName.startsWith('v-')
  }

  // 是否是事件指令
  isEventDirective(type){
    return type.split(':')[0] === 'on'
  }

}