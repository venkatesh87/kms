import Action from '../../../action/action'

export default class FixPosition extends Action {
  constructor (p) {
    super(p)
    this._id = 'graphFixItemPosition'
    this._label = 'Fix Item Position'
  }

  execute () {
  }
}
