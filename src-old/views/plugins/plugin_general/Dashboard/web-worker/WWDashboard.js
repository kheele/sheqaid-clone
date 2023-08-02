export default() => {
    self.on("list", function (ack) {
        const list = [
        ];
        ack(list);
    });
};