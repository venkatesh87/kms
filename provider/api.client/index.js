/**
 * Web API provider for client to access server
 * TODO cache loaded graph
 */
import EventEmitter from 'eventemitter3'
import Graph from '../graph/index'

export default class APIClient extends EventEmitter {
  constructor (p = {}) {
    super()
    this.p = p
  }
  /**
   * DEPRECATED
   * the whole repository shouldn't be transfered to the client
   */
  read () {
    return new Promise((resolve, reject) => {
      // this.getLinkedItem(this.p.root)
      d3.json(this.p.url, (data) => {
        const graph = new Graph(data)
        resolve(graph)
      })
    })
  }
  /**
   * Translate graph function calls to server
   */
  request (method, ...args) {
    const promise = new Promise((resolve, reject) => {
      const request = $.post({
        url: this.p.url,
        data: {
          method,
          args: JSON.stringify(args),
        },
      })
      request.then((data) => {
        const graph = data.items && data.links ? new Graph(data) : data
        resolve(graph)
      })
    })
    return promise
  }
}
