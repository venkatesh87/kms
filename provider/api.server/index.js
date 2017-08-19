/**
 * Server API provider
 * endpoint for api.client module
 */
import _ from 'lodash'

export default class APIServer {
  constructor (p) {
    this.p = p
    this.graph = p.graph
    this.provider = p.provider
  }

  async request (params) {
    console.info(`Request params: ${JSON.stringify(params)}`)
    const args = JSON.parse(params.args)
    const result = this.graph[params.method](...args)

    if (params.method === 'get') {
      args.push(this.p)

      // TODO handle items (binary) not in the graph
      return this.provider.get(...args)
    } else if (params.method === 'set') {
      await this.provider.set(result, this.graph.get(result), this.graph.getLinks(result), this.p)
    } else if (_.includes(['associate', 'remove', 'setDisassociate', 'merge'], params.method)) {
      // TODO _.includes(params.method, 'set')
      _.each(result, async (key) => {
        // TODO do not write items not in the graph (they may be just external links)
        await this.provider.set(key, this.graph.get(key), this.graph.getLinks(key), this.p)
      })
    } else {
      // TODO store searches to provider
    }
    return result
  }
}
