const listImpl = require('./listImpl');

class Cntr extends ACntr {
    constructor() {
        super('inspections/');

        const {addAction} = this;
        addAction('listTemplatesByLogged', this.listTemplatesByLogged.bind(this));
    }

    //<editor-fold desc="listTemplatesByLogged">
    async listTemplatesByLogged(socket, data) {
        return listImpl(socket, data);
    }
    //</editor-fold>

}

module.exports = new Cntr();