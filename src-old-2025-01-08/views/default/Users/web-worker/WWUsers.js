export default (self) => {
    self.on("users/list", function (ack) {
        const list = [];
		for(var n = 1; n <=10; n++) {
            list.push({id: n, fname: "User" + n, lname: "User" + n, email: "kheelet@gmail.com", phone: "+266 5611 8107", user_type: "Administrator", log_count: 7});
        }
        ack(list);
    });
    self.on("users/list/filter", function (data, ack) {
        const list = [];
		for(var n = 1; n <=10; n++) {
            list.push({id: n, fname: "User" + n + " Filtered", lname: "User" + n + " Filtered", email: "kheelet@gmail.com", phone: "+266 5611 8107", user_type: "Administrator", log_count: 7});
        }
        ack(list);
    });
};