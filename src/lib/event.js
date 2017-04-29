import Vue from 'vue'
import store from '@/store'

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
  es = createEventSource(store.state.server + '/api/event');
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

export function createEventSource(url) {
  if (store.state.auth.enabled) url += '?authorization=' + btoa(store.state.auth.name + ':' + store.state.auth.pwd)
  return new EventSource(url)
}
