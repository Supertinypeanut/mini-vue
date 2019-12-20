/**
 * 观察者模式，数据劫持data中的数据
*/

class Observer{
  constructor(data){
    this.data = data
    
    // 代理data数据
    this.walk(data)
  }

  // 代理对象数据属性   
  walk(data){
    // 对传入数据是否是对象进行校验
    if (!data || typeof data != 'object') {
      return
    }
    // 对该对象所有属性进行劫持
    Object.keys(data).forEach(key => {
      this.observer(data, key, data[key])

      // 对属性进行
      this.walk(data[key])
    })
  }

  // 劫持属性
  observer(data, key, value){
    let that = this
    // 创建订阅发布者对象
    let dep = new Dep()
    Object.defineProperty(data, key,{
      enumerable:true,  // 可枚举
      configurable:true,  // 可更改
      get(){
        // 如果Dep.target中有watcher对象，存储到订阅者数组中
        Dep.target && dep.addSubs(Dep.target)
        return value
      },
      set(newValue){
        // 数据未修改则不更新
        if (value === newValue) {
          return
        }
        value = newValue

        // 避免修改的数据为复杂数据类型
        that.walk(newValue)
        // 发布通知，让所有的订阅者更新内容
        dep.notify()
      }
    })
  }
}