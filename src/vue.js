/**
 * 实现一个 mini vue
 * */

class Vue {
  constructor(options = {}) {
    //   Vue实例属性
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods

    new Observer(options.data)

    //   判断是否传入$el,传入则编译解析
    if (this.$el) {
      // 对模版进行编译
      new Compile(this.$el, this)
    }

    // 将data属性代理到Vue实例上
    this.proxy(this.$data) 
    // 将methods属性代理到Vue实例上
    this.proxy(this.$methods) 
  }

  // 因为Observer已经对data内部数据进行代理了，所以只需要将data代理到实例上即可
  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] == newValue) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}