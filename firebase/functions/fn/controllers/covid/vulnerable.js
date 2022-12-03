
class Cntr extends ACasesCntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/COVID_Management/vulnerable/', 'plugin_sheq_assist_COVID_Management_vulnerable');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};