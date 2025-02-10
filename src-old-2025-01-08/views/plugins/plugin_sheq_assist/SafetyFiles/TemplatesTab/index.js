import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ClearableInput, Clickable} from 'components/inputs';
import {THead} from 'components/tables';

import {NewTemplateDialog, EditTemplateDialog, ProfileTemplateDialog,} from './forms';
import {NewQuestionnaireDialog} from '../SafetyFilesTab/forms';

import style from "./TemplatesTab.lazy.css";
import TemplateTableRow from "./TemplateTableRow";

@observer
class TemplatesTab extends React.Component {
    pageKey = "TemplatesTab";
    
    @observable
    state = {
        lists: {
            visibility: [
                {text: 'Only My Company', value: 'OnlyMyCompany', checked: false},
                {text: 'Every Company', value: 'EveryCompany', checked: true}
            ],
            answered_by: [
                {text: 'Sender', value: 'Sender', checked: false},
                {text: 'Recipient', value: 'Recipient', checked: false}
            ]
        }
    }

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
        
        this.onCopy = this.onCopy.bind(this);
        this.onUseLibrary = this.onUseLibrary.bind(this);
        
        this.onSaveAs = this.onSaveAs.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }
    //</editor-fold>

    //<editor-fold desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    //</editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
            visibility,
            answered_by,
        } = filterData || {};

        const listByLogged = sockets.of('safety-files').fn('listTemplatesByLogged');

        return listByLogged({
            name,
            visibility,
            answered_by,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>
    
    //<editor-fold desc="actions">
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }

    onUseLibrary(evt, elem) {
        // const {idx, action} = elem.props;
        // const item = this.refs.root.list[idx];

        // const newQuestionnaireDialog = this.refs.root.getDialogByRef("newQuestionnaireDialog");
        // newQuestionnaireDialog.
        // extraProp('template', item).
        // open(item);
        
        const {isContractorView} = storage.is;
        if (!isContractorView) {
            const {onOpenContractorsTab} = this.props;
            return infoDialog.open(<div>
                Please first <b>
                <Clickable onClick={onOpenContractorsTab}>
                    <a href="#">Open Contractor</a>
                </Clickable>
            </b> tab
            </div>);
        }
        const {idx, action} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.newQuestionnaireDialog.open(item);
    }

    async onSaveAs(e, el) {
        const {idx, type} = el.props;
        const item = this.refs.root.list[idx];
        if (type === 'PDF') {
            // this.refs.pdfReader.open(item);
        } else if (type === 'Excel') {

        }
    }
    //</editor-fold>

    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {
            id,
            data: {
                created_at,
                name,
                desc,
                status,
                status_answered_by_sender,
                answered_by,
                is_template,
                visibility,
                page_title_list,
                question_list,
            }
        } = item;

        const isPrivate = visibility === "Private";
        const isAnsweredByRecipient = answered_by !== "Sender";

        const permissionKey = !storage.is.isContractor && "Contractor Documents";
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {isPrivate && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {isPrivate && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            <NavItem action="writable" idx={idx} onClick={this.onUseLibrary} faIconLeft="plus"
                     title="Use Template"/>
            {/*<hr action="writable"/>
            <NavItem action="writable" idx={idx} type='PDF' refName={`pdfReader`} onClick={this.onSaveAs} title='Save As PDF'/>
            <NavItem action="writable" idx={idx} type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>*/}
        </Options>;
    }
    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Questionnare Title" className="form-control"
                            onChange={onChange}/>
            <ClearableInput name="visibility" type="radio" placeholder="Visible To" className="form-control"
                            onChange={onChange} values={this.state.lists.visibility} returnValue/>
            <ClearableInput name="answered_by" type="radio" placeholder="Needs Answers From" className="form-control"
                            onChange={onChange} values={this.state.lists.answered_by} returnValue/>
        </div>;
    }
    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Name</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-180">Questionnaires Used</div>
            <div className="td fixed-flex min-w-100">Questions</div>
            <div className="td fixed-flex min-w-80">Visibility</div>
            <div className="td fixed-flex min-w-160">Needs Answers From</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <TemplateTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onOpenContractorsTab} = this.props;
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
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
            
            <NewTemplateDialog ref="newDialog"/>
            <EditTemplateDialog ref="editDialog"/>
            <ProfileTemplateDialog ref="profileDialog" onOpenContractorsTab={onOpenContractorsTab}/>
            
            <NewQuestionnaireDialog ref="newQuestionnaireDialog"/>
        </APageListReadWrite>;
    }
    //</editor-fold>
}

export default TemplatesTab;
