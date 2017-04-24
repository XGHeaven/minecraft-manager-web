import Resource from './resource'

export const server = new Resource('server', '/api')
export const serverLog = server.child('log')
export const jar = new Resource('jar', '/api')
export const version = new Resource('version', '/api')
export const save = new Resource('save', '/api')
export const backup = save.child('backup')
