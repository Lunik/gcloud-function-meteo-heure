/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
const Meteo = require('./lib/meteo.js')

exports.meteo = (req, res) => {
  let responseFormat = req.query.format || 'text'
  let lang = req.query.lang || 'fr'
  let location = req.query.location || 692660
  
  let meteo = new Meteo(location)
  
  meteo.report(responseFormat, lang).then((response) => {
    switch (responseFormat) {
      case 'json':
        res.json(response)
      case 'text':
        res.end(response)
    }
  }).catch((err) => {
    console.log(err)
    res.status(500)
    res.json(JSON.stringify(err))
  })
}
