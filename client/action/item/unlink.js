import Action from '../action'

export default class Unlink extends Action {
  constructor (p) {
    super(p)
    this._id = 'itemUnlink'
    this._label = 'Unlink'
    this._icon = 'mdi mdi-link-variant-off'
    this.group = 'item'
  }

  _execute () {
    const keys = this.registrar.currentView.selection.getAll()
    const key1 = keys.shift()

    this.registrar.itemman.unlinkItems(key1, keys)
  }

  evaluate (selection) {
    super._evaluate(selection.getCount() > 1)
  }
}
