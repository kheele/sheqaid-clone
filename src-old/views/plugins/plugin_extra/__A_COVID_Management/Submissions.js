
class Submissions {
    static path = "plugin_sheq_assist/COVID_Management/covid-submission-api/";
    
    static async submitScreening(businessid, list) {
        return window.neonBinding.events.emit(Submissions.path + 'submitScreening', businessid, list);
    }

    static async submitTestData(businessid, list) {
        return window.neonBinding.events.emit(Submissions.path + 'submitTestData', businessid, list);
    }

    static async submitReturnToWork(businessid, list) {
        return window.neonBinding.events.emit(Submissions.path + 'submitReturnToWork', businessid, list);
    }

    static async submitVulnerability(businessid, list) {
        return window.neonBinding.events.emit(Submissions.path + 'submitVulnerability', businessid, list);
    }

}

export default Submissions;