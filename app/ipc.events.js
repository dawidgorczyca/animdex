import { app, ipcMain } from 'electron'
import { mainWindow } from './main.dev'

const ipcEvents = []

// TODO: Build in INFO LOG

function generateIpcEvents(emitter, events) {
  Object.keys(events).forEach(( eventName, index ) => {
    const responseName = `${eventName}/RESPONSE`
    const ipcEventName = `${emitter.name}/${eventName}`
    const ipcResponseName = `${emitter.name}/${responseName}`
    ipcEvents.push(ipcEventName, responseName)

    ipcMain.on(ipcEventName, (event, ...args) => {
      emitter.emit(eventName, ...args)
    })

    emitter.on(responseName, (event, ...args) => {
      mainWindow.webContents.send(ipcResponseName, event)
    })
  })
}

function ipcLayerInit(emitters) {
  Object.keys(emitters).forEach((emitterName, index) => {
    const emitter = emitters[emitterName]
    const events = emitter.events

    generateIpcEvents(emitter, events)
  })
}

module.exports.init = ipcLayerInit
module.exports.eventsList = ipcEvents
