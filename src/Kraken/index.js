'use strict'

const axios = require('axios')
const Config = use('Config')
const FormData = require('form-data')
const fs = require('fs')
const stream = require('stream')

class Kraken {
  constructor (inputConfig) {
    this.options = inputConfig.merge('kraken', Config.get('kraken'))
  }

  /**
   * Optimise image from URL
   *
   * @param {Object} body
   * @param {Function} cb
   */
  async url (body = {}) {
    try {
      return axios.post('https://api.kraken.io/v1/url', this._attachConfig(body))
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
   * Optimise image from direct upload
   *
   * @param {Object} body
   */
  async upload (body = {}) {
    try {
      let form = new FormData()
      form.append('file', this._getStreamedFile(body.file), this._getFileName(this._getStreamedFile(body.file)))
      delete body.file
      form.append('data', JSON.stringify(this._attachConfig(body)))
      return axios.post('https://api.kraken.io/v1/upload', form, this._getFormHeaders(form))
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
   * Get status for authenticated user (quota used/remaining etc)
   */
  async userStatus (formatSizes = false) {
    try {
      let { data } = await axios.post('https://api.kraken.io/user_status', this._attachConfig())
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

  /**
   * Attaches config data to request body
   *
   * @param {Object} body
   */
  _attachConfig (body = {}) {
    return {
      auth: {
        api_key: this.options.apiKey || this.options.api_key || '',
        api_secret: this.options.apiSecret || this.options.api_secret || '',
      },
      dev: this.options.sandboxMode,
      ...body,
    }
  }

  /**
   * Gets an streamable instance of a file
   *
   * @param {*} file
   */
  _getStreamedFile (file) {
    return (file && file instanceof stream.Stream) ? file : fs.createReadStream(file)
  }

  /**
   * Gets the filename from a streamed file
   *
   * @param {Stream} file
   */
  _getFileName (file) {
    return file.filename || 'file'
  }

  /**
   * Gets the auto-generated headers from a form
   *
   * @param {FormData} form
   */
  _getFormHeaders (form) {
    return { headers: form.getHeaders() }
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
}

module.exports = Kraken
