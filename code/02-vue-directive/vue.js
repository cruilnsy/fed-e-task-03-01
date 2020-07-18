class Vue {
  constructor (options) {
    this.$options = options || {}
    this.$data  = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    this.compile(this.$el)
  }

  compile (el) {
    let childNodes = el.childNodes

    // assume we only have v-for and v-html attributes
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)){
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, key)
  }

  // v-for
  forUpdater (node) {
    let vmKey = node.getAttribute('v-for').split('in')[1].trim()
    let forKey = node.getAttribute(':key').split('.')[1].trim()

    // Need to complete if  the node is an element, need to compile and set the vm to for variable
    // let content = node.childNodes.nodeType == 3 ? node.textContent : node.childNodes

    let reg = /\{\{(.+?)\}\}/
    let contentValue = node.textContent
    let contentKey = null
    if (reg.test(contentValue)) {
      contentKey = RegExp.$1.trim().split('.')[1]
    }

    let parentNode = node.parentNode
    parentNode.textContent = null

    this.$data[vmKey].forEach(item => {
      let temp = document.createElement(node.nodeName)
      temp.setAttribute('key', item[forKey])
      temp.textContent = contentValue.replace(reg, item[contentKey])
      parentNode.appendChild(temp)
    })
  }

  // v-html
  htmlUpdater (node, key) {
    node.innerHTML = this.$data[key]
  }

  isDirective (attrName) {
    return attrName.startsWith('v-')
  }

  isElementNode (node) {
    return node.nodeType === 1
  }
}