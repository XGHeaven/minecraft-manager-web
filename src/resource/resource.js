import store from '../store'
import Vue from 'vue'
import path2Regexp from 'path-to-regexp'

class Resource {
  constructor(name, prefix, parent) {
    if (prefix instanceof Resource) {
      parent = prefix
      prefix = ''
    }
    this.name = name
    this.parent = parent
    if (this.parent instanceof Resource) {
      this.paramPath = this.indexPath = this.parent.paramPath + prefix
    } else {
      this.paramPath = this.indexPath = prefix
    }
    this.indexPath += '/' + name
    this.paramPath += '/' + name + '/:' + name
    this.compiledIndexPath = path2Regexp.compile(this.indexPath)
    this.compiledParamPath = path2Regexp.compile(this.paramPath)
  }

  index(param) {
    return Vue.http.get(this.indexUrl(param))
  }

  create(param, data) {
    return Vue.http.post(this.indexUrl(param), data)
  }

  get(param) {
    return Vue.http.get(this.paramUrl(param))
  }

  update(param, data) {
    return Vue.http.put(this.paramUrl(param), data)
  }

  delete(param) {
    return Vue.http.delete(this.paramUrl(param))
  }

  indexUrl(param) {
    return store.state.server + this.compiledIndexPath(param)
  }

  paramUrl(param) {
    return store.state.server + this.compiledParamPath(param)
  }

  child(name) {
    this[name] = new Resource(name, this)
    return this[name]
  }
}

export default Resource
