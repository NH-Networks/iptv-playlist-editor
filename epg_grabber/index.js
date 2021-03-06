'use strict'

const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)
const grabber = []
const ProviderParser = require(path.join(__dirname, 'provider-xmltv.js'))

const init = function (db) {
  this.db = db
  // Init all grabbers
  fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  }).forEach(function (file) {
    if (file !== 'provider-xmltv.js') {
      const Grabber = require(path.join(__dirname, file))
      grabber.push(new Grabber(db))
    }
  })
  // Init provider grabbers
  db.Provider.findAll().then(function (Providers) {
    Providers.forEach(function (provider) {
      grabber.push(new ProviderParser(db, provider.id))
    })
  })
}

const addProvider = function (provider) {
  grabber.push(new ProviderParser(this.db, provider.id))
}

module.exports.init = init
module.exports.grabber = grabber
module.exports.addProvider = addProvider
