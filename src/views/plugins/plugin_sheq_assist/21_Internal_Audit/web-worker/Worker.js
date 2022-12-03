export default () => {
    self.on("plugin_sheq_assist/08_Environmental_Aspects/reports/stats", function (ack) {
		let res = {
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
    
	//later
	self.on("plugin_sheq_assist/08_Environmental_Aspects/matrix/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/matrix/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n + " Filtered"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/pollution-register/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Jun-2019", title: "Sample Title" + n, surveyed_by: "Thamahane Kheele"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/pollution-register/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Jun-2019", title: "Sample Title" + n + " Filtered", surveyed_by: "Thamahane Kheele"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/incidents/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, incident_num: "099088928", incident_date: "02-Jun-2019", department: "Sample Department" + n, incident_investigator: "Thamahane Kheele", injured_person: "Teslo Goa"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/incidents/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, incident_num: "099088928", incident_date: "02-Jun-2019", department: "Sample Department" + n + " Filtered", incident_investigator: "Thamahane Kheele", injured_person: "Teslo Goa"});
		}
        ack(list);
    });
	self.on("plugin_sheq_assist/08_Environmental_Aspects/incidents/remedial-action-plan/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Jun-2019", she_department: "Jenson Marko", she_committee_chairperson: "Thamahane Kheele", management: "Japh Manoah", incident_assessor: "Thabo Clarkson", person_involved: "Teslo Goa"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/incidents/remedial-action-plan/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Jun-2019", she_department: "Jenson Marko Filtered", she_committee_chairperson: "Thamahane Kheele", management: "Japh Manoah", incident_assessor: "Thabo Clarkson", person_involved: "Teslo Goa"});
		}
        ack(list);
    });
	self.on("plugin_sheq_assist/08_Environmental_Aspects/incidents/cause-analysis/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, general_agents: "Sample Agent " + n, occupational_health_or_enririnmental_agents: "Sample " + n, total_cost: "R 9800.00"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/incidents/cause-analysis/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, general_agents: "Sample Agent " + n + " Filtered", occupational_health_or_enririnmental_agents: "Sample " + n, total_cost: "R 2500.00"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/enviro-ra/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Sample Title" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/enviro-ra/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Sample Title" + n + " Filtered"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/checklist/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/checklist/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n + " Filtered"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/qap/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/qap/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n + " Filtered"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/emp/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/emp/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n + " Filtered"});
		}
        ack(list);
    });

	self.on("plugin_sheq_assist/08_Environmental_Aspects/ncr/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date_recorded: "30-Apr-2020", non_conformance_num: "90089889", identified_by: "Thamahane Kheele", department_or_area: "Sample Area" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/08_Environmental_Aspects/ncr/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date_recorded: "30-Apr-2020", non_conformance_num: "90089889", identified_by: "Thamahane Kheele", department_or_area: "Sample Area" + n + " Filtered"});
		}
        ack(list);
    });

	
};