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
    }

  }

  /* 核心方法 */
  nodeToFragment(node) {
    const fragment = document.createDocumentFragment()
      // 获取所有子节点(包括文本节点、元素节点)
    let childrens = node.childNodes
    this.toArray(childrens).forEach(element => {
      // 把所有节点都添加到fragment中
      fragment.appendChild(element)
    })
  }


  /* 工具方法 */

  // 类数组转为数组
  toArray(nodeList) {
    return [].slice.call(nodeList)
  }

}