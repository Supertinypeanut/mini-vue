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
    Object.defineProperty(data, key,{
      enumerable:true,  // 可枚举
      configurable:true,  // 可更改
      get(){
        console.log(12)
        return value
      },
      set(newValue){
        value = newValue
      }
    })
  }
}