/** 
 * 监视者：watcher模块负责把compile模块与observe模块关联起来
*/
class Watcher{
  constructor(vm, key, cb){
    this.vm = vm  // 当前vm实例
    this.key = key  // data中的属性名
    this.cb = cb  // 数据改变时触发的回调
    
    // 将当前监视者实例载到构造函数上
    Dep.target = this
    // 存储旧值
    this.oldValue = this.processValue(vm, key)
    // 清空Dep.target
    // Dep.target = null
  }

  update(){
    // 对比是否修改数据
    let oldValue = this.oldValue
    let newValue = this.processValue(this.vm, this.key)
    if (oldValue != newValue) {
      // 调用回调更新页面视图
      this.cb(newValue, oldValue)
    } 
  }


  //用于获取vm中的数据
  processValue(vm, key) {
    // 获取到data中的数据
    let data = vm.$data
    key.split(".").forEach(item => {
      data = data[item]
    })
    return data
  }
}


/** 
 * 订阅-发布者类：管理所有的订阅者和通知这些订阅者
*/
class Dep{
  constructor(){
    // 存储订阅者
    this.subs = []
  }

  // 添加订阅者
  addSubs(watcher){
    this.subs.push(watcher)
  }

  // 通知订阅者
  notify(){
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}