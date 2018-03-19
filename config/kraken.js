'use strict'

const Env = use('Env')

module.exports = {

  /**
   * The access key credentials created through the Kraken dashboard
   */
  api_key: Env.get('KRAKEN_API_KEY') || null,
  api_secret: Env.get('KRAKEN_API_SECRET') || null

}
