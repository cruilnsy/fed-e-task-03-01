let _Vue = null

export default class VueRouter {
  static install (Vue) {
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.mode = options.mode || "hash"
    this.anchor = this.mode === "hash" ? "#" : ""
    this.data = _Vue.observable({
      current: this.anchor + "/"
    })
    this.init()
  }

  init () {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    this.options.routes.forEach(route => {
      this.routeMap[this.anchor + route.path] = route.component
    })
  }

  initComponent (Vue) {
    const self = this

    Vue.component("router-link", {
      props: {
        to: String
      },
      render (h) {
        return h("a", {
          attrs: {
            href: self.anchor + this.to,
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },

      methods: {
        clickHandler (e) {
          history.pushState({}, "", self.anchor + this.to)
          this.$router.data.current = self.anchor + this.to
          e.preventDefault()
        }
      }
    })

    Vue.component("router-view", {
      render (h) {
        const cm = self.routeMap[self.data.current]
        return h(cm)
      }
    })
  }

  initEvent () {
    const eventType = this.mode === "hash" ? "hashchange" : "popstate"
    const pathName = this.mode === "hash" ? "hash" : "pathname"
    window.addEventListener(eventType, () => {
      this.data.current = window.location[pathName]
    })
  }
}