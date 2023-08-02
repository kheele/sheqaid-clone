export default () => {
    self.on("plugin_sheq_assist/calendar/list", function (ack) {
        const list = [];
		const cal = new Date();
		for(var n = 1; n <=10; n++) {
			list.push({id: n, title: "Event" + n, start: (cal.getFullYear() + '-' + cal.getMonth() + '-' + (cal.getDate() + n)), end: (cal.getFullYear() + '-' + cal.getMonth() + '-' + (cal.getDate() + n + n)), allDay: true, resource: "Sample resource"});
		}
        ack(list);
    });
};