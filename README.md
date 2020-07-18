# 崔锐 | Part 3 | 模块一

## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

解答：

不是响应式的。由于 JavaScript 的限制，Vue 不能检测数组和对象的变化。（Vue官方文档）

一般有三种方法，把新增成员设置成 响应式：

(1) 使用Vue的全局方法Vue.set 或 实例方法 vm.$set

`Vue.set(object, propertName, value)` 

e.g. `Vue.set(vm.dog, 'name', 'Trump)` or `this.$set(this.dog, 'name', 'Trump')`

(2) 用原对象与要混合进去的对象的 property 一起创建一个新的对象

[`this.dog](http://this.dog) = Object.assign({}, this.dog, {name: 'Trump')`

(3) 初始化的时候，初始化成员属性

e.g.

```jsx
data: {
  o: 'object',
  dog: {
		name: 'somebody'
	}
 },
```

内部原理：

当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 getter/setter。这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。（官方文档）

在Vue中，一般设有 Vue 的 _proxyData 把data的成员注入到实例中，Observer 监听数据的变化，以及 compiler 解析指令和插值表达式。其中，observer 通过注册dep (发布者)收集依赖并发送 通知给watcher，compiler 通过 watcher 观察数据的变更，从而改变视图。

### 2、请简述 Diff 算法的执行过程

解答：

Vue 模拟 snabbdom，利用虚拟dom，对比新旧 vnode。其实就是解决 `vnode = patch(vnode, newVnode)` 的问题 。在snabbdom中设计 算法diff，主要看 `updateChildren` 方法的逻辑。

1. 判断两个vnode是否相同的函数，可以看到首先比较的是两个节点的key值是否相同，注意的是，当不设置key的时候，undefined与undefined是相等的，后面继续比较vnode的标签，注释节点，是否有数据等条件，以及如果是输入框类型会进行类型校验。从这里我们可以分析出，如果虚拟dom的子元素列表只包含文本节点并且dom结构一致的话，其实不设置key的时候更新dom的效率是更高的，不需要进行过多的判断逻辑，只用patchVnode函数去更新vnode的文本就好，这要比设置了key后进行dom的insert操作高效的多。(sameVnode 函数)
2. 对vnode进行patch操作，更新vnode的内容，包括移除oldVnode的子元素，在oldVnode内部添加子元素，更新文本节点，或者新旧vnode都有子元素的时候，去继续调用updateChildren函数进行diff操作。(patchVnode)
3. 创建一个key与下标为映射关系的对象，当设置了key时可以通过此对象快速找到对应新旧vnode的对应关系。（createKeyToOldIdx）
4. 当不设置key时候，使用此函数找出新旧vnode匹配的下标（findIdxInOld）
5. diff算法的核心方法（updateChildren）

参考：

[https://www.jianshu.com/p/182f3eb8ea31](https://www.jianshu.com/p/182f3eb8ea31)

[https://blog.csdn.net/qq_35469739/article/details/107225591](https://blog.csdn.net/qq_35469739/article/details/107225591)

[https://blog.csdn.net/Sideremens/article/details/97629849](https://blog.csdn.net/Sideremens/article/details/97629849)

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

见 `code/01-vue-router-hash-mode`

主要代码在 `src/router/Vue-Router.js` 中

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

见 `code/02-vue-directive`

主要代码在 `vue.js` 中

### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：

见 `code/03-snabbdom`

主要代码在 `src/movies-list.js`