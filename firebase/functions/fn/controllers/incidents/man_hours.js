
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/17_Incident_Investigation/man-hours/', 'plugin_sheq_assist_17_Incident_Investigation_man_hours');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};