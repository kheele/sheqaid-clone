
class Cntr extends ACasesCntr{
    constructor(Functions) {
        super(Functions, 'plugin_sheq_assist/COVID_Management/screening/', 'plugin_sheq_assist_COVID_Management_screening');
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};