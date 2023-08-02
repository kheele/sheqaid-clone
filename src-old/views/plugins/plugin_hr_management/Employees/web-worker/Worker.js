export default () => {
    self.on("plugin_sheq_assist/02_IMS_Policies/list", function (ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Test Doc" + n, type: 'PDF Document'});
		}
        ack(list);
    });
    self.on("plugin_sheq_assist/02_IMS_Policies/list/filter", function (data, ack) {
		const list = [];
		for(var n = 1; n <= 20; n++) {
		    list.push({id: n, title: "Test Doc" + n + " Filtered", type: 'PDF Document'});
		}
        ack(list);
    });
};