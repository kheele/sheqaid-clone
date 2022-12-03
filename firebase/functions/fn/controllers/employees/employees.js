
const printer = require('./printer');

class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, "plugin_sheq_assist/employees/", "plugin_sheq_assist_employees");
    }

    async createPDF(ctx, id) {
        return printer.createPDF(this, ctx, id);
    }

}

exports.run = (Functions) => {
    new Cntr(Functions);
};