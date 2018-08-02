const Request = require('request-promise')

const BASE_URL = "http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie"
const DEFAULT_LOCATION = 692660
const UNIT_BETWEEN_DATA = 5
const CODE_TEXT = require('./textCode.json')

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
