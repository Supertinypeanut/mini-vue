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

        //解析指令
        if (this.isEventDirective(type)) {
          // 解析事件指令
          CompileUtil.eventHandle(node,this.vm,value,type)
        }else{
          // 解析普通指令
          CompileUtil[type](node, this.vm, value)
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

// 对指令解析实现抽离,成一个工具对象
let CompileUtil = {
  // 普通指令
  text(node, vm, value){
    node.innerText = vm.$data[value]
  },
  html(node, vm, value){
    node.innerHtml = vm.$data[value]
  },
  model(node, vm, value){
    node.value = vm.$data[value]
  },

  // 事件指令
  eventHandle(node,vm,value,type){
    // 对是绑定方法是否存在进行捕获判断
    try {
      // 获取事件类型
      const eventType = type.split(':')[1]
      // 给当前元素注册事件,并且需要改变其this指向
      node.addEventListener(eventType,vm.$methods[value].bind(vm))
    } catch (error) {
      throw Error('检查事件方法是否在methods中定义')
    }
  }
}