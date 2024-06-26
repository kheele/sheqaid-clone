// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {ClearableInput, ProfileField} from 'components/inputs';
import Form from "utils/Form";
import ADocsTab from "./ADocsTab";

import style from "./OtherDocsTab.lazy.css";

// </editor-fold>

@observer
class Dialog extends ADocsTab {
    pageKey = "OtherDocsTab";
    pageTitle = "General Documents";
    pageTitleSingular = "general document";
    title = "General Document";
    type = "General Document";
    doc_type = "General Document";
    module = "General Document";
    extraContent = ExtraContent;
    showCategory = true;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
    }

    // </editor-fold>
}

@observer
class ExtraContent extends React.Component {

    @observable state = {
        lists: {
            category: ['Company Certificate', 'Company Insurance', 'Company Registration', 'Company Regulatory Body']
        }
    };

    constructor(props) {
        super(props);
        this.form = new Form();
    }

    render() {
        const {item = {}, className, readonly} = this.props;
        const category = item.data && item.data.category;
        return <div className="row sec-group">
            {!readonly &&
                <ClearableInput ref="category" name="category" type="select" placeholder="Document Category..."
                                defaultValue={category} className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.category} add returnValue/>}
            {readonly && <ProfileField ref="category" name="category" type="select" placeholder="Document Category"
                                       value={category} className="col-lg-12"/>}
        </div>;
    }
}

export default Dialog;
