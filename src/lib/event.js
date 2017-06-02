import Vue from 'vue'
import store from '@/store'
import url from 'url'

export const bus = new Vue()
export const ADD_CLICK = 'add-click'
export const REFRESH_CLICK = 'refresh-click'

let es

export const SERVER_START = 'server-start'
export const SERVER_STOP = 'server-stop'
export const JAR_INSTALL = 'jar-install'
export const SAVE_BACKUP = 'save-backup'
export const SAVE_ROLLBACK = 'save-rollback'
export const SAVE_START_ROLLBACK = 'save-start-rollback'

function handleSEEvent(event) {
  const data = JSON.parse(event.data)
  bus.$emit(event.type, data, event)
}

export function connect() {
  es = createEventSource('/api/event');
  [SERVER_START, SERVER_STOP, JAR_INSTALL, SAVE_BACKUP, SAVE_ROLLBACK, SAVE_START_ROLLBACK].forEach(event => {
    es.addEventListener(event, handleSEEvent)
  })
}

export function reconnect() {
  disconnect()
  connect()
}

export function disconnect() {
  es.close()
}

export function createEventSource(uri) {
  let parsedUrl = url.parse(uri)
  if (!parsedUrl.hostname) {
    const defaultUrl = url.parse(store.state.address)
    parsedUrl.hostname = defaultUrl.hostname
    parsedUrl.port = defaultUrl.port
    parsedUrl.protocol = defaultUrl.protocol
    store.state.auth.enabled && (parsedUrl.query = (parsedUrl.query || '') + '&authorization=' + btoa(store.state.auth.name + ':' + store.state.auth.pwd))
  }
  uri = url.format(parsedUrl)
  return new EventSource(uri)
}
