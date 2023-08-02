// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {mapQuestionnaires} from "utils/ArrayMapperUtils";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ClearableInput, SelectContractorQuestionnaireTemplateCategoryInput} from 'components/inputs';
import {THead} from 'components/tables';

import {NewDocTemplateDialog, EditDocTemplateDialog, ProfileDocTemplateDialog} from '../forms';

import NewQuestionnaireDialog from '../forms/NewQuestionnaireDialog.js';

import {TemplatesTabTableRow} from '../forms/QuestionnaireAnswersComponents';

import style from "./TemplatesTab.lazy.css";
import {byClient, byCompany} from "./Query/List/listAllContractorQuestionnaireTemplatesByLogged";

// </editor-fold>

@observer
class TemplatesTab extends React.Component {
    path;
    pageKey = "TemplatesTab";
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onDownload = this.onDownload.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(page, isNew) {
        const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
        const {selectedClient, selectedProject, selectedSite} = storage.selected;

        let fn;

        const args = {};

        if(selectedClient) {
            args.client_id = selectedClient.id;
            fn = byClient;
        } else {
            args.company_id = sess_company_id;
            fn = byCompany;
        }

        return fn(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="actions">
    async onDownload(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        
        const {id, data: {latest_version}} = item;
        const {type, doc_num, doc, expiry,} = latest_version || {};
        if(doc) {
            const url = doc.dlUrls && doc.dlUrls[0];
            if(url) {
                document.location = url;
                return;
            }
        }
        
        infoDialog.open('No document available');
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {        
        const permissionKey = !storage.is.isContractor && "Contractor Documents";
        return <Options idx={idx} permissionOtherKey={permissionKey} override>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onDownload} faIconLeft="download" title='Download'/>
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Document Title" className="form-control" onChange={onChange}/>
            <ClearableInput name="doc_num" type="text" placeholder="Document No." className="form-control" onChange={onChange}/>
            <SelectContractorQuestionnaireTemplateCategoryInput name="category" placeholder="Category..." className="form-control" onChange={onChange}/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Document No.</div>
            <div className="td">Document Title</div>
            <div className="td">Category</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-120">Review Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <TemplatesTabTableRow item={item} idx={n} onClick={onClick}/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            forceCreate
            pageId={this.pageKey + "-tab"}
            pageTitle="Templates"
            pageTitleSingular="template"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDocTemplateDialog ref="newDialog"/>
            <EditDocTemplateDialog ref="editDialog"/>
            <ProfileDocTemplateDialog ref="profileDialog"/>
            
            <NewQuestionnaireDialog ref="newQuestionnaireDialog"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

export default TemplatesTab;
