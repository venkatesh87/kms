const _ = require('lodash')
const async = require('async')
const assert = require('assert')
const nightmare = require('nightmare')
const runner = require('../../server/runner')
//const fixture = require('../fixture/index')
// TODO moch fs wouldn't work as server is launched in forked process
const mock = require('mock-fs')

describe('Node manipulation', () => {
  let nm
  const initNM = function (done) {
    nm = nightmare({ show: true })
    done()
  }
  const endNM = function (done) {
    nm.end(done)
  }
  before(() => {
    runner.config('./build/server/instance.js')
    mock({
      '/home/dmitra/dev/kms/build/raw': {
        'ec8585c6-acfc-4353-bad9-992ccac7e8c6': '[["6fc25cf4-1118-40bf-9f42-5358f0c20330",0]]\nvisibleItem',
        '6fc25cf4-1118-40bf-9f42-5358f0c20330': '[["ec8585c6-acfc-4353-bad9-992ccac7e8c6",0]]\nItem to delete',
      },
    })
  })
  beforeEach(function (done) { //eslint-disable-line
    //this.currentTest.title
    // TODO extract fixture for each test by its name
    async.series([
      runner.start,
      initNM,
    ], () => {
      done()
    })
  })
  afterEach(function (done) {
    async.series([
      endNM,
      runner.stop,
    ], () => {
      done()
    })
  })
  after((done) => {
    mock.restore()
    done()
  })
  describe('Create', () => {
    it('should create item by menu', (done) => {
      nm
        .goto('http://localhost:8000')
        .click('li.action[data-id="itemCreate"]')
        .wait('.container')
        .evaluate(() => {
          const res = {}
          res.visibleItems = G.visibleItems.getAll()
          res.id = document.querySelector('.container .canvas .node.selected').__data__
          return res
        })
        .then((res) => {
          assert(_.includes(res.visibleItems, res.id))
          done()
        })
    })
  })
  describe('Delete', function () {
    it('should delete item by menu', (done) => {
      nm
        .goto('http://localhost:8000')
        .wait('.container .canvas .node')
        .click('.container .canvas .node')
        .wait(500)
        .click('li.action[data-id="itemRemove"]')
        .wait(500)
        .click('li.action[data-id="itemCreate"]')
        .evaluate(() => {
          const res = {}
          res.visibleItems = G.visibleItems.getAll()
          // TODO get node by ID
          res.node = document.querySelector('.container .canvas .node')
          return res
        })
        .then((res) => {
          assert.equal(res.visibleItems, 0)
          assert.equal(res.node, null)
          done()
        })
    })
  })
})
