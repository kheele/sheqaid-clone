// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import Form from "utils/Form";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ASelectWrapper">
@observer
class ASelectWrapper extends React.Component {

    innerRefs = {
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onOpenEmployeeListTable && (this.onOpenEmployeeListTable = this.onOpenEmployeeListTable.bind(this));
        this.renderTable && (this.renderTable = this.renderTable.bind(this));

        this.form = new Form();
        this.form.addChangeOne("select_employees", this.onChangeSelectEmployees.bind(this));
    }
    // </editor-fold>

    onChangeSelectEmployees(el, val) {
        this.state.select_employees = val;
    }

    onOpenEmployeeListTable(evt, btn) {
        const {employee_list_exception} = this.innerRefs;
        employee_list_exception && employee_list_exception.show();
    }

    @computed get isSelected() {
        const {action, state} = this.props;
        return state.select_employees === action;
    }

    render() {
        return null;
    }
}
// </editor-fold>

export default ASelectWrapper;