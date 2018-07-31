/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
const Meteo = require('./lib/meteo.js')

exports.meteo = (req, res) => {
  let meteo = new Meteo()
  console.log("Begin")
  meteo.report().then(res.json).catch((err) => {
    console.log("End")
    res.status(500)
    res.json(JSON.stringify(err))
  })
}
