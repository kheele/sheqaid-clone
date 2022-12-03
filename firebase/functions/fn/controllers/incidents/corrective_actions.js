
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/17_Incident_Investigation/corrective_actions/', 'plugin_sheq_assist_17_Incident_Investigation_corrective_actions');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};