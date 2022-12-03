
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/17_Incident_Investigation/flash-reports/', 'plugin_sheq_assist_17_Incident_Investigation_flash_reports');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};