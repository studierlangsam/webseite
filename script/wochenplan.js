const fs = require('fs');
const jsyaml = require('js-yaml');
const luxon = require("luxon");

/**
 * @typedef Effekt
 * @type {object}
 * @property {boolean} Schildi
 * @property {boolean} Fachschaft
 *  
 * @typedef Event
 * @type {object}
 * @property {string} Titel
 * @property {string} Beschreibung
 * @property {luxon.DateTime} Start
 * @property {luxon.DateTime} Ende
 * @property {string} Treffpunkt
 * @property {Effekt} Effekt
 * 
 * @typedef Termin
 * @type {object}
 * @property {luxon.DateTime} Datum
 * @property {Event[]} Termine
 */

module.exports.loadWochenplan = () => {
    const wochenplan = jsyaml.load(fs.readFileSync("content/Wochenplan.yaml"));
    for (let termin of wochenplan) {
        termin.Datum = luxon.DateTime.fromJSDate(termin.Datum, {locale: "de-DE"});
        if (!!termin.Termine) {
            for (let event of termin.Termine) {
                event.Start = luxon.DateTime.fromISO(event.Start, {locale: "de-DE"});
                event.Ende = event.Ende ? luxon.DateTime.fromISO(event.Ende, {locale: "de-DE"}) : undefined;
            }
        }
    }
    return wochenplan;
}