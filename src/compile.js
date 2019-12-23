/**
 * 对模版和数据进行编译
 */

class Compile {
  constructor(el, vm) {
    // Vue中el是可以直接传节点
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm

    // 对节点进行判断是否存在
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
      if (this.isTextNode(node)) {
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
    CompileUtil.mustach(node,this.vm)
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
    return node.nodeType === 3
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
  // 插值
  mustach(node, vm){
    // 获取节点文本内容
    const text = node.textContent
    // 创建校验插值表达式的正则
    const reg = /\{\{(.+)\}\}/
    if (reg.test(text)) {
      // 获取插值中需要解析的文本
      const key = RegExp.$1
      // 获取对应data中的值
      const data = CompileUtil.processValue(vm,key)
      // 替换插值
      node.textContent = text.replace(reg,data)
    
      new Watcher(vm, key, (newValue, oldValue) => {
        node.textContent = newValue
      })
    }
  },

  // 普通指令
  text(node, vm, key){
    node.innerText = this.processValue(vm,key)
    // 创建观察者，数据变化，更新模版数据
    new Watcher(vm, key, (newValue, oldValue) => {
      node.innerText = newValue
    })
  },
  html(node, vm, key){
    node.innerHtml = this.processValue(vm,key)
    new Watcher(vm, key, (newValue, oldValue) => {
      node.innerHtml = newValue
    })
  },
  model(node, vm, key){
    node.value = this.processValue(vm,key)
    new Watcher(vm, key, (newValue, oldValue) => {
      node.value = newValue
    })

    // 给节点加input事件，实现双向数据绑定
    node.addEventListener('input',(e)=>{
      // 获取文本框内容
      const value = e.target.value
      // 获取属性key的数组
      const keys = key.split('.')
      // data数据
      let data = vm.$data
      
      // 解决是复杂数据问题
      keys.forEach((item, index) => {
        // 当到最后一项，进行赋值
        if (index === keys.length - 1) {
          data[item] = value
          return 
        }
        data = data[item]
      })
    })
  },

  // 事件指令
  eventHandle(node,vm,key,type){
    // 对是绑定方法是否存在进行捕获判断
    try {
      // 获取事件类型
      const eventType = type.split(':')[1]
      // 给当前元素注册事件,并且需要改变其this指向
      node.addEventListener(eventType,vm.$methods[key].bind(vm))
    } catch (error) {
      throw Error('检查事件方法是否在methods中定义')
    }
  },

  // 处理复杂数据
  processValue(vm, key){
    // 获取data中的数据对象
    let data = vm.$data
    // 处理插值中复杂数据
    key.split('.').forEach(key => {
      // 获取插值对应的data数据(正则分组)
      data = data[key]
    })
    return data
  }
}