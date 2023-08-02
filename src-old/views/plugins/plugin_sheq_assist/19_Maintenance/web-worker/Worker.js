export default () => {
    self.on("plugin_sheq_assist/19_Maintenance/tools/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Mar-2019", category: "Hand Tools", name: "Spade " + n, barcode: "98274778" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/19_Maintenance/tools/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Mar-2019", category: "Hand Tools", name: "Spade " + n + " Filtered", barcode: "98274778" + n});
		}
        ack(list);
    });
	
    self.on("plugin_sheq_assist/19_Maintenance/tools-witten-off/pending/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Mar-2019", category: "Hand Tools", name: "Plyer " + n, barcode: "877887" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/19_Maintenance/tools-witten-off/pending/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Mar-2019", category: "Hand Tools", name: "Plyer " + n + " Filtered", barcode: "877887" + n});
		}
        ack(list);
    });
	self.on("plugin_sheq_assist/19_Maintenance/tools-witten-off/approved/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Mar-2019", category: "Hand Tools", name: "Harmer " + n, barcode: "644487" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/19_Maintenance/tools-witten-off/approved/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, date: "02-Mar-2019", category: "Hand Tools", name: "Harmer " + n + " Filtered", barcode: "644487" + n});
		}
        ack(list);
    });
	
    self.on("plugin_sheq_assist/19_Maintenance/maintanance-plan/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/19_Maintenance/maintanance-plan/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n + " Filtered"});
		}
        ack(list);
    });
    
	self.on("plugin_sheq_assist/19_Maintenance/calibration-record/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/19_Maintenance/calibration-record/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Fork Lift" + n + " Filtered"});
		}
        ack(list);
    });
};