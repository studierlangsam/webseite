const fs = require('fs');
const jsyaml = require('js-yaml');

/**
* @typedef Karriere
* @type {object}
* @property {string} Studiengang
* @property {number} Jahr
* @property {number} Urlaubssemester
* @property {bool} Sommersemester 
* 
* @typedef Tutor
* @type {object}
* @property {string} Name
* @property {string} Spruch
* @property {Karriere[]} Karriere
*/

/**
 * @returns {Tutor[]}
 */
module.exports.loadTutors =  () => {
    const files = fs.readdirSync("content/tutors").filter((file) => !file.startsWith('_'));
    return files
        .map((file) => {
            const yaml = fs.readFileSync(`content/tutors/${file}`, {encoding: 'utf-8'});
            return jsyaml.load(yaml);
        })
        .filter(t => fs.existsSync(`images/tutoren/${t.Name}.jpg`))
        .sort((t1, t2) => t1.Name.localeCompare(t2.Name, 'de-DE'));
}