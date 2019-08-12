'use strict'

const { ServiceProvider } = require.main.require('@adonisjs/fold')

class KrakenProvider extends ServiceProvider {
  register () {
    this._registerKraken()
    this._registerCommands()
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Kraken:GetConfig')
  }

  _registerKraken () {
    this.app.singleton('Kraken', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const Kraken = require('../src/Kraken')
      return new Kraken(Config)
    })
  }

  _registerCommands () {
    this.app.bind('Kraken:GetConfig', () => require('../commands/GetConfig'))
  }
}

module.exports = KrakenProvider
