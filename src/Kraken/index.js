'use strict'

const fs = require("fs")
const stream = require("stream")
const axios = require("axios")
const FormData = require('form-data')

const Config = use('Config')

class Kraken {

  constructor (inputConfig) {
    this.options = inputConfig.merge('kraken', Config.get('kraken'))

    this.auth = {
      api_key: this.options.api_key || '',
      api_secret: this.options.secret || ''
    }

    this.api_url = this.options.base_api_url || 'https://api.kraken.io/v1'
  }

  /**
   * Creates an HTTP response handler
   *
   * @param {Function} cb
   */
  _createResponseHandler (cb) {
    return function (err, res, body) {
      if (err) return cb(err)

      return (body.success === false)
        ? cb(new Error(body.message))
        : cb(undefined, body)
    }
  }

  /**
   * Pass the given image URL along with credentials to Kraken API via HTTPS POST
   *
   * @param {Object} body
   * @param {Function} cb
   */
  url (body = {}, cb) {
    body.auth = this.auth

    request.post({
      url: `${this.api_url}/url`,
      json: true,
      strictSSL: false,
      body
    }, this._createResponseHandler(cb))
  }

  /**
   * Upload the given file along with credentials to Kraken API via HTTPS POST
   *
   * @param {Object} opts
   */
  async upload (opts = {}) {
    opts.auth = this.auth

    let form = new FormData()

    form.append('file', (opts.file && opts.file instanceof stream.Stream)
      ? opts.file
      : fs.createReadStream(opts.file)
    )

    delete opts.file

    form.append('data', JSON.stringify(opts))

    axios.post(`${this.api_url}/upload`, form, { headers: form.getHeaders() })
      .then((response) => response)
      .catch((error) => {
        console.log(error)
        return error
      })
  }

}

module.exports = Kraken
