const Request = require('request-promise')

const BASE_URL = "http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie"
const DEFAULT_LOCATION = 692660
const UNIT_BETWEEN_DATA = 5
const CODE_TEXT = {
  '-1': 'Données indisponibles',
  '0': 'Données indisponibles',
  '1': 'Aucune pluie',
  '2': 'Pluie faible',
  '3': 'Pluie modérée',
  '4': 'Pluie forte',
}

class API {
  constructor (location) {
    location = location || DEFAULT_LOCATION

    this.apiURL = `${BASE_URL}/${location}`
  }

  get_report () {
    return new Promise((resolve, reject) => {
      Request.get({
        uri: this.apiURL
      }).then((data) => {
        resolve(JSON.parse(data))
      }).catch(reject)
    })
  }
}

module.exports = {
  API,
  CODE_TEXT,
  UNIT_BETWEEN_DATA
}
