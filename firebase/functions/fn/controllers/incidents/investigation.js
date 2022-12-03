
class Cntr extends ACntr{
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/17_Incident_Investigation/investigations/', 'plugin_sheq_assist_17_Incident_Investigation_investigations');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};