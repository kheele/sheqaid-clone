
global.ACntr = require('./ACntr').ACntr;

const employees = require('./employees');
const assets = require('./assets');

const hira = require('./hira');
const covid = require('./covid');
const incidents = require('./incidents');
const internal_audits = require('./internal_audits');
const doc_and_record_control = require('./doc_and_record_control');

const docs = require('./docs');

exports.run = (eventManager) => {
    employees.run(eventManager);
    assets.run(eventManager);

    hira.run(eventManager);
    covid.run(eventManager);
    incidents.run(eventManager);
    internal_audits.run(eventManager);
    doc_and_record_control.run(eventManager);

    docs.run(eventManager);
};

