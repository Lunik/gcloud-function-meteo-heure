const moment = require('moment')

const API = require('./api.js')

module.exports = class Meteo {
  constructor (location) {
    this.api = new API.API(location)
  }

  report () {
    return this._calculate_report().then((report) => {
      var formatedReport = {}
      const beginDate = new Date(report.date)

      for (let r in report.changes) {
        let date = new Date(beginDate.setMinutes(beginDate.getMinutes() + parseInt(r)))
        formatedReport[date.toLocaleTimeString()] = API.CODE_TEXT[report.changes[r]]
      }

      return formatedReport
    })
  }

  _parse_date (string) {
    const format = "YYYYMMDDHHmm"
    return moment(string, format)
  }

  _calculate_report () {
    return this.api.get_report().then((json) => {
      var now = json.dataCadran[0].niveauPluie
      var changes = {
        '0': now,
      }
      var nextChange = 0
      while (nextChange < json.dataCadran.length - 1) {
        nextChange = this._get_next_change(json.dataCadran, now, nextChange)
        now = json.dataCadran[nextChange].niveauPluie
        changes[nextChange * API.UNIT_BETWEEN_DATA] = json.dataCadran[nextChange].niveauPluie
      }

      return {
        date: this._parse_date(json.echeance),
        changes
      }
    })
  }

  _get_next_change (cadran, now, from) {
    let current = from + 1
    while (current < cadran.length - 1 && cadran[current].niveauPluie == now) {
      current++
    }

    if (current >= cadran.length) {
      current = cadran.length - 1
    }

    return current
  }
}
