import store from '../store'
import Vue from 'vue'
import path2Regexp from 'path-to-regexp'
import querystring from 'querystring'

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

  index(param, query) {
    return Vue.http.get(this.indexUrl(param, query))
  }

  create(param, data, query) {
    return Vue.http.post(this.indexUrl(param, query), data)
  }

  get(param, query) {
    return Vue.http.get(this.paramUrl(param, query))
  }

  update(param, data, query) {
    return Vue.http.put(this.paramUrl(param, query), data)
  }

  delete(param, query) {
    return Vue.http.delete(this.paramUrl(param, query))
  }

  indexUrl(param, query) {
    return store.state.address + this.compiledIndexPath(param) + (query && ('?' + querystring.stringify(query)) || '')
  }

  paramUrl(param, query) {
    return store.state.address + this.compiledParamPath(param) + (query && ('?' + querystring.stringify(query)) || '')
  }

  child(name) {
    this[name] = new Resource(name, this)
    return this[name]
  }
}

export default Resource
