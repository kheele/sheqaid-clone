import {observer} from 'mobx-react';
import ACol from "./ACol";

@observer
class SettingsCol extends ACol {

    title = "General Settings";
    sockets = sockets.of("settings-categories");

    constructor(props) {
        super(props);
    }

    renderAccordionSummary(item, idx) {
        return `${item}`;
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

export default SettingsCol;
