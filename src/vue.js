/**
 * 实现一个 mini vue
 * */

class Vue {
  constructor(options = {}) {
    this.$el = options.el,
      this.$data = options.data
  }
}