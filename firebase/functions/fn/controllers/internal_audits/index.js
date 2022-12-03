
const safety_observations_report = require('./safety_observations_report');
const forms = require('./forms');
const checklist = require('./checklist');
const inspections = require('./inspections');
const registers = require('./registers');
const ncr = require('./ncr');
const construction_audits = require('./construction_audits');

exports.run = (eventManager) => {
	safety_observations_report.run(eventManager);
	forms.run(eventManager);
	checklist.run(eventManager);
	inspections.run(eventManager);
	registers.run(eventManager);
	ncr.run(eventManager);
	construction_audits.run(eventManager);
};

