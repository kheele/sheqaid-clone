import {observer} from 'mobx-react';
import ACol from "./ACol";


@observer
class NotificationsCol extends ACol {

    title = "Notification Settings";
    sockets = sockets.of("settings-categories");

    constructor(props) {
        super(props);
    }

    get list() {
        return [
            'Asset Management',
            'Chemicals Management',
            'Contractor Management',
            'Employee Expired Documents',
            'Employee Profile',
            'Incident Management',
            'Inspection Management',
            'None-Conformance Management',
            'Training Management',
            'Expired Documents',
        ]
    }

    renderAccordionSummary(item, idx) {
        return `${item} Notifications`;
    }

    renderAccordionDetails(item, idx) {
        return `
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
        `;
    }

    onAdd(evt, btn) {
        const {idx} = btn.props;
    }

    onRemove(evt, btn) {
        const {idx} = btn.props;
    }
}

export default NotificationsCol;
