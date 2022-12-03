
const baseline = require('./baseline');
const taskbase = require('./taskbase');
const sop = require('./sop');
const wswp = require('./wswp');

exports.run = (eventManager) => {
    baseline.run(eventManager);
    taskbase.run(eventManager);
    sop.run(eventManager);
    wswp.run(eventManager);
};

