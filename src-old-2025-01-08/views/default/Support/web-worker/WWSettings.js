export default (self) => {
    self.on("list", function (ack) {
        const list = [
        ];
        ack(list);
    });
};