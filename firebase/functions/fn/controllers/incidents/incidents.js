
const printer = require('./printer');

class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/17_Incident_Investigation/', 'plugin_sheq_assist_17_Incident_Investigation');
    }
//    
//    async createPDF(ctx, id) {
//        return printer.createPDF.call(this, ctx, id);
//    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};