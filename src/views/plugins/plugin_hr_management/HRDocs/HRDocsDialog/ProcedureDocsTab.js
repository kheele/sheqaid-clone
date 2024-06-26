// <editor-fold defaultstate="collapsed" desc="imports">
import {observer} from 'mobx-react';
import ADocsTab from "./ADocsTab";

import style from "./ProcedureDocsTab.lazy.css";

// </editor-fold>

@observer
class Dialog extends ADocsTab {
    pageKey = "ProcedureDocsTab";
    pageTitle = "Procedures";
    pageTitleSingular = "procedure";
    title = "Procedure";
    type = "Procedure";
    doc_type = "Procedure";
    module = "Procedures";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
    }

    //</editor-fold>
}

export default Dialog;
