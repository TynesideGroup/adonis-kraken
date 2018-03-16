'use strict'

const defaultConfig = require('../../config/kraken.js')

class Kraken {

  constructor (Config) {
    this.options = Config.merge('kraken', defaultConfig)
  }

}

module.exports = Kraken
