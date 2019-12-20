/**
 * 实现一个 mini vue
 * */

class Vue {
  constructor(options = {}) {
    //   Vue实例属性
    this.$el = options.el,
      this.$data = options.data
      this.$methods = options.methods

    //   判断是否传入$el,传入则编译解析
    if (this.$el) {
      // 对模版进行编译
      new Compile(this.$el, this)
    }

  }
}