
class Cntr extends ACasesCntr {
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/COVID_Management/return-to-work/', 'plugin_sheq_assist_COVID_Management_return-to-work');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};