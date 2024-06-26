// <editor-fold defaultstate="collapsed" desc="imports">
import {observer} from 'mobx-react';
import ADocsTab from "./ADocsTab";

import style from "./PolicyDocsTab.lazy.css";

// </editor-fold>

@observer
class Dialog extends ADocsTab {
    pageKey = "PolicyDocsTab";
    pageTitle = "Policies";
    pageTitleSingular = "policy";
    title = "Policy";
    type = "IMS Policy";
    doc_type = "IMS Policy";
    module = "_02_IMS_Policies";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
    }

    // </editor-fold>
}

export default Dialog;
