import {API_URL} from '../_config'
import socketIOClient from 'socket.io-client'

export const socketUtil = (eventName: string, cb: Function) => {
  let tmpBloomAuth = localStorage.getItem('_bloomauth') || '{}'
  let tmpToken = JSON.parse(tmpBloomAuth)
  if (tmpToken.token) {
    const socket = socketIOClient(`${API_URL}/api?token=${tmpToken.token}`)

    socket.on(eventName, res => cb(null, res))
  }
}
