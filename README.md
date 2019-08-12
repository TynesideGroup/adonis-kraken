# adonis-kraken

Service provider for working with [Kraken.io](https://www.kraken.io) (image optimisation service)

## Installation
* Run `adonis install adonis-kraken` within your Adonis project
* Add `'adonis-kraken/providers/KrakenProvider'` to the `providers` array within `start/app.js`

## Configuration
There are two ways to configure this package, both of which require a `config/kraken.js` file to exist within your project. This file should have automatically been copied to your project during installation if you installed it via adonis-cli, however if you installed it with npm or Yarn, or the file was not copied across correctly, you can manually copy the [config file](config/kraken.js) from this package or run the following command to create it:
```bash
adonis kraken:getconfig
```
By default this configuration file is set up to read `KRAKEN_API_KEY` and `KRAKEN_API_SECRET` variables from your `.env` file so that they remain secret (as this file should **not** be included in your code repository!) however you are free to override this behaviour by modifying the `config/kraken.js` file and setting the `apiKey` and `apiSecret` properties there.

> **WARNING** - It is dangerous to leave your API credentials directly in `config/kraken.js` in a public code repository as anyone will be able to read/use them - do so at your own risk!

## Usage
Add `const Kraken = use('Kraken')` at the top of whatever file you wish to use this package. This package then exposes three methods:

| Method | Arguments | Description |
|:---|:---|:---|
| `url` | Object `{...}` | Optimize an image from a URL |
| `upload` | Object `{...}` | Optimize an image directly from an upload. Must be a `Stream` or an image that can be converted to a Readable Stream! |
| `userStatus` | Boolean `formatSizes` | Gives you a brief overview of your Kraken.io account (quota used, quota remaining etc). Passing `true` will automatically format data supplied by Kraken in KB/MB/GB etc (by default this will just be a number of Bytes) |

See below for examples on how each method would be used.

## Examples
```js
'use strict'

const Kraken = use('Kraken')

class MyController {
  /**
   * Optimize an image via a URL
   */
  async optimizeImageViaURL () {
    const { data } = await Kraken.url({
      url: 'http://placehold.it/50x50',
      wait: true
    })
    console.log(data)
    return { status: 'success' }
  }

  /**
   * Optimize an image via a file upload
   */
  async optimizeImageViaUpload ({ request }) {
    // Get access to the uploaded file. We are using a method
    // which means we do not need to save the file to our local
    // filesystem first!
    // (http://adonisjs.com/docs/4.1/file-uploads#_streaming_files)
    request.multipart.file('file', {}, async (file) => {
      const { data } = await Kraken.upload({
        file: file.stream,
        wait: true
      })
      console.log(data)
    })

    // We must call the following when using this method of handling
    // uploaded files
    await request.multipart.process()

    return { status: 'success' }
  }

  /**
   * Get some quota stats based on the active API key/secret
   */
  async getUserStatus () {
    const { data } = await Kraken.userStatus({ formatSizes: true })
    return data
  }
}

module.exports = MyController
```
