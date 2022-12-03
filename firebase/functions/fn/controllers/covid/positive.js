
class Cntr extends ACasesCntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/COVID_Management/positive/', 'plugin_sheq_assist_COVID_Management_positive');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};