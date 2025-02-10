import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, ProfileField} from 'components/inputs';

import AMain from '../../common/documents/AMain';

@observer
class DocumentsTab extends AMain {

    pageKey = "DocumentsTab";
    type = "General Document";

    createBtnTitle="Upload New";
    pageTitle = "Company Documents";
    pageTitleSingular = "Company Document";
    permissionKey = "Company_Document";
    ExtraContent = ExtraContent;

    @observable state = {
        lists: {
            types: [{value: "Upload", text: "PDF", checked: false}, {value: "Type", text: "Typed", checked: false}]
        }
    };
    
    constructor(props) {
        super(props);
    }
    
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="type" type="radio" placeholder="Document Type" className="form-control fixed-flex min-w-355" onChange={onChange} values={this.state.lists.types}/>
            <ClearableInput name="title" type="text" placeholder="Name of Document" className="form-control" onChange={onChange}/>
            <ClearableInput name="owner" type="text" placeholder="Owner" className="form-control" onChange={onChange}/>
        </div>;
    }
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
            {!readonly && <ClearableInput ref="category" name="category" type="select" placeholder="Document Category..." defaultValue={category} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.category} add returnValue/>}
            {readonly && <ProfileField ref="category" name="category" type="select" placeholder="Document Category" value={category} className="col-lg-12"/>}
        </div>;
    }
}

export default DocumentsTab;
