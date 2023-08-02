export default () => {
    self.on("plugin_sheq_assist/05_Training/reports/stats", function (ack) {
        const res = {
            stats_count: {
                cost: 9999000,
                completed_trainings: 50,
                outstanding_trainings: 4,
                accredited_trainings: 75,
                non_accredited_trainings: 25
            }
        };
        ack(res);
    });

    self.on("plugin_sheq_assist/05_Training/training/manuals/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Training Test" + n, list: []});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/training/manuals/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Training Test" + n + " Filtered", list: []});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/training/certificates/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Certificate Sample" + n});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/training/certificates/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Certificate Sample" + n + " Filtered"});
        }
        ack(list);
    });

    self.on("plugin_sheq_assist/05_Training/induction-training/manuals/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Training Test" + n, list: []});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/induction-training/manuals/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Training Test" + n + " Filtered", list: []});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/induction-training/certificates/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Certificate Sample" + n});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/induction-training/certificates/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", title: "Certificate Sample" + n + " Filtered"});
        }
        ack(list);
    });

    self.on("plugin_sheq_assist/05_Training/training-register/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", training: "Training Test" + n, trainer: "Thamahane Kheele", time_or_duration: "2 Weeks", list: []});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/training-register/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, date: "03-Apr-2019", training: "Training Test" + n + " Filtered", trainer: "Thamahane Kheele", time_or_duration: "2 Weeks", list: []});
        }
        ack(list);
    });

    self.on("plugin_sheq_assist/05_Training/training-matrix/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, hr: "Dyke Bali" + n, job_title: "Supervisor", job_desc: "Test Desc"});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/training-matrix/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, hr: "Dyke Bali" + n + " Filtered", job_title: "Supervisor", job_desc: "Test Desc"});
        }
        ack(list);
    });

    self.on("plugin_sheq_assist/05_Trainings/toolbox-talks/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, title: "Test Name" + n});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Trainings/toolbox-talks/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, title: "Test Name" + n + " Filtered"});
        }
        ack(list);
    });

    self.on("plugin_sheq_assist/05_Training/personal-info/list", function (ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, name: "Thamahane Kheele" + n});
        }
        ack(list);
    });
    self.on("plugin_sheq_assist/05_Training/personal-info/list/filter", function (data, ack) {
        const list = [];
        for (var n = 1; n <= 20; n++) {
            list.push({id: n, name: "Thamahane Kheele" + n + " Filtered"});
        }
        ack(list);
    });
};