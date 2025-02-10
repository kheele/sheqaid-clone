export default () => {
    self.on("plugin_sheq_assist/17_Incident_Investigation/list", function (ack) {
		let yr = new Date().getFullYear();
		let mon = "Feb";
		let day = new Date().getDate();
        const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, record_num: "354353" + n, incident_date: (yr + "-" + mon + "-" + (day + n)), incident_status: "Complete", investigation_status: "Complete", impact_type: "Impact Type1"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/17_Incident_Investigation/list/filter", function (data, ack) {
		let yr = new Date().getFullYear();
		let mon = "Feb";
		let day = new Date().getDate();
        const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, record_num: "354353" + n + " Filtered", incident_date: (yr + "-" + mon + "-" + (day + n)), incident_status: "Complete", investigation_status: "Complete", impact_type: "Impact Type1"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/17_Incident_Investigation/flash-reports/list", function (ack) {
        const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, name_of_injured_peron: "Person" + n, occupation: "Foreman", employer: "Harmony", incident_type: "Type1", reported_by: {id: n, name: "Thamahane Kheele"}});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/17_Incident_Investigation/flash-reports/list/filter", function (data, ack) {
        const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, name_of_injured_peron: "Person" + n + " Filtered", occupation: "Foreman", employer: "Harmony", incident_type: "Type1", reported_by: {id: n, name: "Thamahane Kheele"}});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/17_Incident_Investigation/man-hours/list", function (ack) {
		let yr = new Date().getFullYear();
		let mon = "February";
		let day = new Date().getDate();
        const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, year: yr, month: mon, fiscal_year: (yr + "-" + mon + "-" + (day + n))});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/17_Incident_Investigation/man-hours/list/filter", function (data, ack) {
		let yr = new Date().getFullYear();
		let mon = "Feb";
		let day = new Date().getDate();
        const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, year: yr, month: mon, fiscal_year: (yr + "-" + mon + "-" + (day + n))});
		}
        ack(list);
    });
};