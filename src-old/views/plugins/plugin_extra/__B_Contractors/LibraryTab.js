// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';
import {mapQuestionnaires} from "../../../../utils/ArrayMapperUtils";
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ClearableInput, Clickable} from '../../../../components/inputs';
import {THead} from '../../../../components/tables';

import NewLibraryDialog from './dialogs/NewLibraryDialog.js';
import EditLibraryDialog from './dialogs/EditLibraryDialog.js';
import ProfileLibraryDialog from './dialogs/ProfileLibraryDialog.js';

import NewQuestionnaireDialog from './dialogs/NewQuestionnaireDialog.js';

import ProfilePDFReader from './printers/ProfileLibraryPDFReader';

import {LibraryTabTableRow} from './dialogs/QuestionnaireAnswersComponents';

import style from "./LibraryTab.lazy.css";

// </editor-fold>

@observer
class LibraryTab extends React.Component {
    path;
    pageKey = "LibraryTab";
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            visibility: [
                {text: 'Only My Company', value: 'OnlyMyCompany', checked: false}, 
                {text: 'Every Company', value: 'EveryCompany', checked: true}
            ],
            answered_by: [
                {text: 'Sender', value: 'Sender', checked: false}, 
                {text: 'Receipient', value: 'Receipient', checked: false}
            ]
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'questionnaires/library/';

        this.onCopy = this.onCopy.bind(this);
        this.onUseLibrary = this.onUseLibrary.bind(this);
        
        this.onSaveAs = this.onSaveAs.bind(this);
        
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
    
    // <editor-fold defaultstate="collapsed" desc="actions">
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }

    onUseLibrary(evt, elem) {
        const {isContractorView} = storage.is;
        if(!isContractorView) {
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
        if(type === 'PDF') {
            this.refs.pdfReader.open(item);
        } else if(type === 'Excel') {
            
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {id, data: {created_at, form: {name, desc, questions, answered_by = 'Receipient'}, visibility}} = item;
        
        const isPrivate = visibility === "OnlyMyCompany";
        const isAnsweredByReceipient = answered_by !== "Sender";
        
        const permissionKey = !storage.is.isContractor && "Contractor Documents";
        return <Options idx={idx} permissionOtherKey={permissionKey} override>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {isPrivate && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {isPrivate && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            <NavItem action="writable" idx={idx} onClick={this.onUseLibrary} faIconLeft="plus" title="Use Master Questionnaire"/>
            {/*<hr action="writable"/>
            <NavItem action="writable" idx={idx} type='PDF' refName={`pdfReader`} onClick={this.onSaveAs} title='Save As PDF'/>
            <NavItem action="writable" idx={idx} type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>*/}
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Questionnare Title" className="form-control" onChange={onChange}/>
            <ClearableInput name="visibility" type="radio" placeholder="Visible To" className="form-control" onChange={onChange} values={this.state.lists.visibility} returnValue/>
            <ClearableInput name="answered_by" type="radio" placeholder="Needs Answers From" className="form-control" onChange={onChange} values={this.state.lists.answered_by} returnValue/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Questionnare</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-100">Questions</div>
            <div className="td fixed-flex min-w-100">Visibility</div>
            <div className="td fixed-flex min-w-160">Needs Answers From</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <LibraryTabTableRow item={item} idx={n} onClick={onClick}/>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onOpenContractorsTab} = this.props;
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            forceCreate
            pageId={this.pageKey + "-tab"}
            pageTitle="Master Questionnaires"
            pageTitleSingular="template"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewLibraryDialog ref="newDialog"/>
            <EditLibraryDialog ref="editDialog"/>
            <ProfileLibraryDialog ref="profileDialog" onOpenContractorsTab={onOpenContractorsTab}/>
            
            <NewQuestionnaireDialog ref="newQuestionnaireDialog"/>
            
            <ProfilePDFReader ref="pdfReader"/>
        </APageListReadWrite>;
    }
    // </editor-fold>
}

export default LibraryTab;
