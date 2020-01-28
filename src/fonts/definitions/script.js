const https = require('https')
const fs = require('fs')

fs.mkdirSync(__dirname + '/../files/merriweather')

fs.readFile(__dirname + '/merriweather.css', (err, data) => {
  const string = data.toString()

  const urlCalls = string.match(/url\((.*?)\)/g)

  for (const urlCall of urlCalls) {
    const [, url] = urlCall.match(/url\((.*?)\)/)

    const parts = url.split('/')
    const fileName = parts[parts.length - 1]

    https.get(url, res => {
      const stream = fs.createWriteStream(
        __dirname + `/../files/merriweather/${fileName}`
      )
      res.pipe(stream)
    })
  }
})
