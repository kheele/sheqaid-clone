// <editor-fold defaultstate="collapsed" desc="imports">
import {observer} from 'mobx-react';
import ADocsTab from "./ADocsTab";

import style from "./ProjectPlanDocsTab.lazy.css";

// </editor-fold>

@observer
class Dialog extends ADocsTab {
    pageKey = "ProjectPlanDocsTab";
    pageTitle = "Project Plans";
    pageTitleSingular = "procedure";
    title = "Project Plan";
    type = "Project Plan";
    doc_type = "Project Plan";
    module = "Project Plans";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
    }

    //</editor-fold>
}

export default Dialog;
