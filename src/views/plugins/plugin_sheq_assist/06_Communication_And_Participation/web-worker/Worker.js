export default () => {
    self.on("plugin_sheq_assist/06_Communication_And_Participation/safety-meeting/minutes/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/06_Communication_And_Participation/safety-meeting/minutes/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n + " Filtered"});
		}
        ack(list);
    });
	self.on("plugin_sheq_assist/06_Communication_And_Participation/safety-meeting/upcoming-meetings/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n, participants: [{name: 'Rhesso Gui', contact: 'rhes@gmail.com'}]});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/06_Communication_And_Participation/safety-meeting/upcoming-meetings/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n + " Filtered", participants: [{name: 'Rhesso Gui', contact: 'rhes@gmail.com'}]});
		}
        ack(list);
    });
    
	self.on("plugin_sheq_assist/06_Communication_And_Participation/management-meeting/minutes/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/06_Communication_And_Participation/management-meeting/minutes/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n + " Filtered"});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/06_Communication_And_Participation/management-meeting/upcoming-meetings/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n, participants: []});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/06_Communication_And_Participation/management-meeting/upcoming-meetings/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "01-May-2020", time: "9AM", agenda: "Test Agenda" + n + " Filtered", participants: []});
		}
        ack(list);
    });
    
	self.on("plugin_sheq_assist/06_Communication_And_Participation/kpi/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/06_Communication_And_Participation/kpi/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n + " Filtered"});
		}
        ack(list);
    });
};