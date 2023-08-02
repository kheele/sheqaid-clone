export default () => {
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/drill/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "29-Apr-2020", area: "Sample Area" + n, team_members: []});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/drill/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "29-Apr-2020", area: "Sample Area" + n + " Filtered", team_members: []});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/report/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "29-Apr-2020", shift: "Sample Shift" + n, type: "Sample Type"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/report/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "29-Apr-2020", shift: "Sample Shift" + n + " Filtered", type: "Sample Type"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/matrix/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "29-Apr-2020", title: "Sample Title" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/matrix/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "29-Apr-2020", title: "Sample Title" + n + " Filtered"});
		}
        ack(list);
    });
	
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/internal/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, contacts: "086 029 2992", designation: "Sample Desig.", name: "Thamahane Kheele" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/internal/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, contacts: "086 029 2992", designation: "Sample Desig.", name: "Thamahane Kheele" + n + " Filtered"});
		}
        ack(list);
    });
	self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/external/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, org_name: "Police Department " + n, area: "Sample Area", contacts: "086 029 2992"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/external/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, org_name: "Police Department " + n + " Filtered", area: "Sample Area", contacts: "086 029 2992"});
		}
        ack(list);
    });
	
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-procedure/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, type: "PDF Document", title: "Sample Title" + n + " Filtered"});
		}
        ack(list);
    });
	
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-roll-call/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "23-Feb-2019", department: "Sample Department" + n, division: "Division 1", location: "Loaction Sample", floor: "Floor 3", floor_warden_name: "Sample Name", attendance_register: []});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/emergency-roll-call/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "23-Feb-2019", department: "Sample Department" + n + " Filtered", division: "Division 1", location: "Loaction Sample", floor: "Floor 3", floor_warden_name: "Sample Name", attendance_register: []});
		}
        ack(list);
    });
	
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/evaluation-record/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, training_date: "02-Feb-2020", starting_time: "11AM", ending_time: "3PM", method_of_announcing_emergency: "Sample Method" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/16_Emergency_Preparedness/evaluation-record/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, training_date: "02-Feb-2020", starting_time: "11AM", ending_time: "3PM", method_of_announcing_emergency: "Sample Method" + n + " Filtered"});
		}
        ack(list);
    });
};