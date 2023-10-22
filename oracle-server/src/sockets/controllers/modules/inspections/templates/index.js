const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

class Cntr extends ACntr {
    constructor() {
        super('inspections/');

        const {addAction} = this;
        addAction('findByIdTemplate', this.findByIdTemplate.bind(this));
        addAction('listTemplatesByLogged', this.listTemplatesByLogged.bind(this));
    }

    //<editor-fold desc="findByIdTemplate">
    async findByIdTemplate(socket, data) {
        return findByIdImpl(socket, data);
    }
    //</editor-fold>

    //<editor-fold desc="listTemplatesByLogged">
    async listTemplatesByLogged(socket, data) {
        return listImpl(socket, data);
    }
    //</editor-fold>

}

module.exports = new Cntr();