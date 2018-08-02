/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
const Meteo = require('./lib/meteo.js')

exports.meteo = (req, res) => {
  let meteo = new Meteo()
  let responseType = req.query.format || 'json'
  
  meteo.report(responseType).then((response) => {
    res.json(response)
  }).catch((err) => {
    console.log(err)
    res.status(500)
    res.json(JSON.stringify(err))
  })
}
