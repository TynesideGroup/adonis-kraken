'use strict'

const Env = use('Env')

const parseEnvBoolean = (val) => (val && (val.toLowerCase === 'true'))

module.exports = {
  /**
   * The access key credentials created through the Kraken dashboard
   */
  apiKey: Env.get('KRAKEN_API_KEY') || null,
  apiSecret: Env.get('KRAKEN_API_SECRET') || null,

  /**
   * Enable Kraken's sandbox developer mode for testing purposes
   */
  sandboxMode: parseEnvBoolean(Env.get('KRAKEN_SANDBOX_MODE')),
}
