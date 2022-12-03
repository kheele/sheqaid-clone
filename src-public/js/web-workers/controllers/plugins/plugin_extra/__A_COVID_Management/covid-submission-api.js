
(() => {
    class Controller extends AControllerRead {
        constructor(events, db) {
            super(events, db, {singular: "COVID Submission", plural: "COVID Submissions"}, "plugin_sheq_assist/COVID_Management/covid-submission-api/");

            const {addAction} = this;

            addAction('submitScreening', this.submitScreening.bind(this));
            addAction('submitTestData', this.submitTestData.bind(this));
            addAction('submitReturnToWork', this.submitReturnToWork.bind(this));
            addAction('submitVulnerability', this.submitVulnerability.bind(this));
        }

        async sendReqImpl(name, businessid, list) {
            return Events.whenLoggedIn(async loggedUser => {
                console.log('sendReqImpl send', name, businessid, list);
                try {
                    const fn = functions.httpsCallable(`callables-covidSubmissionApi-${name}`);
                    const res = await fn({businessid, list});
                    const {data} = res || {};
                    console.log('sendReqImpl res', name, data);
                    return data;
                } catch (err) {
                    console.error('sendReqImpl: ', name, err)
                    throw err;
                }
            });
        }

        async submitScreening(evt, ...args) {
            return this.sendReqImpl('submitScreening', ...args);
        }

        async submitTestData(evt, ...args) {
            return this.sendReqImpl('submitTestData', ...args);
        }

        async submitReturnToWork(evt, ...args) {
            return this.sendReqImpl('submitReturnToWork', ...args);
        }

        async submitVulnerability(evt, ...args) {
            return this.sendReqImpl('submitVulnerability', ...args);
        }

    }

    new Controller(events, db);
})();