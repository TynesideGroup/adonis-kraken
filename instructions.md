## Register Provider
You must register the provider inside the `start/app.js` file by adding it to the `providers` Array:

```js
const providers = [
  // ...
  'adonis-kraken/providers/KrakenProvider'
]

```
## Configuration
Configuration is done through `config/kraken.js`. This file should have automatically been copied to your project during installation if you installed it via adonis-cli. If you installed it with npm or Yarn, or the file was not copied across correctly, you can manually copy the [config file](config/kraken.js) from this package or run the following command to create it:
```bash
adonis kraken:getconfig
```
