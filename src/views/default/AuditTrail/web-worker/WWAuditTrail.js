export default (self) => {
    self.on("audit-trail/list", function (ack) {
        const list = [];
		for(var n = 1; n <=10; n++) {
			list.push({id: n, user: {id: 1, name: "Thamahane Kheele", user_type: "Basic"}, target: {id: 1, coll_name: "users", title: "User 3", desc: "the user", date: "01-03-2020"}, type: "Created"});
		}
        ack(list);
    });
    self.on("audit-trail/list/filter", function (data, ack) {
        const list = [];
		for(var n = 1; n <=10; n++) {
			list.push({id: n, user: {id: 1, name: "Thamahane Kheele Filtered", user_type: "Basic"}, target: {id: 1, coll_name: "users", title: "User 3", desc: "the user", date: "01-03-2020"}, type: "Created"});
		}
        ack(list);
    });
};