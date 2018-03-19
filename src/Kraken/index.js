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
      api_secret: this.options.api_secret || ''
    }
  }

  /**
   * Rounds bytes to nearest KB, MB, GB etc
   *
   * @param {Integer} bytes
   * @param {Integer} decimals
   */
  _formatBytes ({ bytes, decimals = 2 }) {
    if (parseFloat(bytes === 0)) return '0 Bytes'
    const k = 1024,
          i = Math.floor(Math.log(bytes) / Math.log(k)),
          s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + s[i]
  }

  /**
   * Optimise image from URL
   *
   * @param {Object} body
   * @param {Function} cb
   */
  async url (body = {}) {
    try {
      body.auth = this.auth
      const { data } = await axios.post('https://api.kraken.io/v1/url', body)
      return data
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
   * Optimise image from direct upload
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
    return axios.post('https://api.kraken.io/v1/upload', form, { headers: form.getHeaders() })
      .then((response) => response)
      .catch((error) => {
        console.log(error)
        return error
      })
  }

  /**
   * Get status for authenticated user (quota used/remaining etc)
   */
  async userStatus (body = {}, formatSizes = true) {
    try {
      body.auth = this.auth
      let { data } = await axios.post('https://api.kraken.io/user_status', {
        auth: {
          api_key: this.auth.api_key,
          api_secret: this.auth.api_secret
        }
      })
      if (formatSizes) {
        data.quota_total = this._formatBytes({ bytes: data.quota_total })
        data.quota_used = this._formatBytes({ bytes: data.quota_used })
        data.quota_remaining = this._formatBytes({ bytes: data.quota_remaining })
      }
      return data
    } catch (error) {
      console.log(error)
      return error
    }
  }

}

module.exports = Kraken
