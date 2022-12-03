
const quick_incidents = require('./quick_incidents');
const incidents = require('./incidents');
const investigation = require('./investigation');
const corrective_actions = require('./corrective_actions');
const man_hours = require('./man_hours');
const flash_reports = require('./flash_reports');

exports.run = (eventManager) => {
    quick_incidents.run(eventManager);
    incidents.run(eventManager);
    investigation.run(eventManager);
    corrective_actions.run(eventManager);
    man_hours.run(eventManager);
    flash_reports.run(eventManager);
};
