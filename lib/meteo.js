const moment = require('moment')
const Mustache = require('mustache')

const API = require('./api.js')
const Phrases = require('./phrases.json')

module.exports = class Meteo {
  constructor (location) {
    this.api = new API.API(location)
  }

  report (format, lang) {
    return this._calculate_report().then((report) => {
      switch (format) {
        case 'json':
          return this._report_json(report, lang)
        case 'text':
          return this._report_text(report, lang)
      }
    })
  }

  _report_json (report, lang) {
    var formatedReport = {}
    const beginDate = new Date(report.date)
    
    for (let r in report.changes) {
      let date = new Date(beginDate.setMinutes(beginDate.getMinutes() + parseInt(r)))
      formatedReport[date.toLocaleTimeString()] = API.CODE_TEXT[report.changes[r]]
    }

    return formatedReport
  }
  
  _report_text (report, lang) {
    var formatedReport = ""
    const beginDate = new Date(report.date)
    
    for (let r in report.changes) {
      let date = new Date(beginDate.setMinutes(beginDate.getMinutes() + parseInt(r)))
      let rand = Math.floor(Math.random() * Phrases[lang].length)
      formatedReport += Mustache.render(Phrases[lang][rand], {
        time: date.toLocaleTimeString(),
        weather: API.CODE_TEXT[report.changes[r]]
      })
    }

    return formatedReport
  }
  
  _parse_date (string) {
    const format = "YYYYMMDDHHmm"
    return moment(string, format)
  }

  _calculate_report () {
    return this.api.get_report().then((json) => {
      var now = json.dataCadran[0].niveauPluie
      var changes = {}
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
