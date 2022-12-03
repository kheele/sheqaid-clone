
global.ACasesCntr = require('./cases_impl').ACasesCntr;
const screening = require('./screening');
const positive = require('./positive');
const vulnerable = require('./vulnerable');
const return_to_work = require('./return-to-work');

exports.run = (eventManager) => {
    screening.run(eventManager);
    positive.run(eventManager);
    vulnerable.run(eventManager);
    return_to_work.run(eventManager);
};

