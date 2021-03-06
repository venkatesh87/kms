/**
 * Grid view
 * Items are represented with tiles
 */
import radialLayout from 'plusjs/src/layout/Radial'
import Layout from './layout'

export default function Radial (p) {
  Layout.call(this, p)
  this.name = 'Radial'
  this._radial = radialLayout()
    .size([this.width, this.height])
    .position(d => d.index)
    .radius((Math.min(this.width, this.height)) / 2 * 0.8)
}
Radial.prototype = Object.create(Layout.prototype)

Radial.prototype.run = function (items) {
  _.each(items, (item, key) => {
    if (!item.index) item.index = key // eslint-disable-line no-param-reassign
  })
  this._radial(items)
}
