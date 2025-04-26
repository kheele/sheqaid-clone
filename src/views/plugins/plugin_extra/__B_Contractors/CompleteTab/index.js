import React from "react";
import {observer} from 'mobx-react';

import style from "./CompleteTab.lazy.css";
import APageListReadWrite from "views/APageListReadWrite";
import ConfirmDialog from "components/dialogs/ConfirmDialog";

import {toJS} from "mobx";
import NavItem from "components/navs/NavItem";
import {ClearableInput, SelectQuestionnaireTemplateInput,} from "components/inputs";
import {THead} from "components/tables";
import CompleteTabTableRow from "./CompleteTabTableRow";
import {updateQuestionnaire} from "mutations/update";

import ProfileQuestionnairePDFReader from "../printers/ProfileQuestionnairePDFReader";
import ProfileResponsePDFReader from "../printers/ProfileResponsePDFReader";
import NewDocTemplateDialog from "../forms/NewDocTemplateDialog";

import NewQuestionnaireDialog from "../forms/NewQuestionnaireDialog";
import EditQuestionnaireDialog from "../forms/EditQuestionnaireDialog";
import ProfileQuestionnaireDialog from "../forms/ProfileQuestionnaireDialog";
import ProfileResponseDialog from "../forms/ProfileResponseDialog";

@observer
class CompleteTab extends React.Component {
    pageKey = "CompleteTab";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onCopy = this.onCopy.bind(this);
        this.onSaveAsTemplate = this.onSaveAsTemplate.bind(this);

        this.onViewResponses = this.onViewResponses.bind(this);
        this.onMarkAsIncomplete = this.onMarkAsIncomplete.bind(this);

        this.onExport = this.onExport.bind(this);
        this.onRemoved = this.onRemoved.bind(this);
        this.onSaveAs = this.onSaveAs.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    //</editor-fold>

    //<editor-fold desc="mounts">
    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        const {status} = this;

        const limit = 0;

        const args = {
            status,
            //
            limit,
            //
            exact_orgs: true,
        };

        // byLogged(args)/*.then((res) => {
        //     console.log(`questionnaires/onUpdate`, res)
        //     const {list} = this.refs.root;
        // questionnairesOnUpdate(list, {updateVal, data});
        // })*/;
//         this.onPromise = workers.on(`${this.props.path}questionnaires/onUpdate`, ({updateVal, data}) => {
// //            console.log(`${this.props.path}questionnaires/onUpdate`, updateVal, data)
//             const {list} = this.refs.root;
//             questionnairesOnUpdate(list, {updateVal, data});
//         });
    }

    componentWillUnmount() {
        style.unuse();
        // workers.off(`${this.props.path}questionnaires/onUpdate`, this.onPromise);
    }

    //</editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
            template_id,
        } = filterData || {};

        const listByLogged = sockets.of('contractors/questionnaires').fn('listCompletedByLogged');

        return listByLogged({
            name,
            template_id,
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

    // <editor-fold defaultstate="collapsed" desc="actions">
    onViewResponses(evt, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        this.refs.responseDialog.open(item);
    }

    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }

    onSaveAsTemplate(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        copy.data.status = "New";
        this.refs.newTemplateDialog.open(copy);
    }

    onMarkAsIncomplete(evt, el) {
        const {status} = el.props;
        this.onUpdateImpl(el, {status});
    }

    onUpdateImpl(el, attrs) {
        return confirmDialog.open("Are you sure you want to confirm this action?").then(res => {
            if (res === 1) {
                const {idx} = el.props;
                const item = this.refs.root.list[idx];

                progressDialog.open("Please wait...");
                return updateQuestionnaire({id: item.id, ...attrs}).then(res => {
                    if (res && attrs.status === 'CompleteDeclined') {
                        this.refs.root.list.removeIf((val, n) => n === idx);
                    }

                    console.log("res", res)
                    extendObservable(item.data, attrs);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    return true;
                }).finally(() => {
                    progressDialog.close();
                });
            }
        });
    }

    onRemoved(item) {
        this.refs.root.list.removeIf((v, n) => v.id === item.id);
    }

    onExport(e, el) {
        const {idx, type, title} = el.props;
        const item = this.refs.root.list[idx];
        popover.settings({
            style: {width: 'auto', minWidth: 200},
            isDialog: true,
            contentNode: <div>
                <p className="padding-t-10 text-center">{title}</p>
                <hr className="margin-t-0 margin-b-0"/>
                <NavItem idx={idx} type='PDF' refName={`profile${type}PDFReader`} onClick={this.onSaveAs}
                         title='Save As PDF'/>
                <NavItem idx={idx} type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>
            </div>
        }).open();
    }

    async onSaveAs(e, el) {
        const {idx, type, refName} = el.props;
        const item = this.refs.root.list[idx];
        const {[refName]: dialog} = this.refs;
        if (type === 'PDF') {
            dialog.open(item);
        } else if (type === 'Excel') {

        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {isContractor} = storage.is;

        const item = this.refs.root.list[idx];
        const {
            id,
            data: {
                created_at,
                name: formName,
                desc,
                status = "New",
                status_answered_by_sender,
                answered_by = 'Recipient',
                is_template,
                visibility,
                page_title_list,
                question_list,
            }
        } = item;

        const isAnsweredBySender = answered_by === "Sender";

        let shouldMarkAsIncomplete;

        if (isAnsweredBySender) {
            shouldMarkAsIncomplete = !!isContractor;
        } else {
            shouldMarkAsIncomplete = !isContractor;
        }

        const permissionKey = !isContractor && "Contractor Documents";
        return <Options idx={idx} permissionOtherKey={permissionKey} readonly={isContractor} override>
            {!isContractor && <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>}
            {!isContractor && <NavItem action="remove" override onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            {!isContractor && <hr/>}
            <NavItem onClick={this.onViewResponses} faIconLeft="eye" title="Responses"/>
            {shouldMarkAsIncomplete &&
                <NavItem status="CompleteDeclined" onClick={this.onMarkAsIncomplete} faIconLeft="check"
                         title="Mark As Incomplete"/>}

            {!isContractor && <hr action="writable"/>}
            {!isContractor &&
                <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>}
            {/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsTemplate} faIconLeft="copy" title="Save As Template"/>*/}
            {/*<hr action="writable"/>*/}
            {/*<NavItem action="writable" idx={idx} type="Questionnaire" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Questionnaire"/>*/}
            {/*<NavItem action="writable" idx={idx} type="Response" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Responses"/>*/}
        </Options>;
    }

    // </editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        const listByLogged = sockets.of('contractors/library').fn('listByLogged');

        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <SelectQuestionnaireTemplateInput
                name="template"
                placeholder="Questionnaire Library..."
                className="form-control"
                byLogged={listByLogged}
                onChange={onChange}
            />
        </div>;
    }

    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td">Questionnaire</div>
            <div className="td fixed-flex min-w-100">Questions</div>
            <div className="td fixed-flex min-w-100">Responses</div>
            <div className="td fixed-flex min-w-140">Non-Compliance</div>
            <div className="td fixed-flex min-w-120">Compliance</div>
            <div className="td fixed-flex min-w-100">Status</div>
            <div className="td fixed-flex min-w-270">Progress</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <CompleteTabTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            hasCreateBtn={() => !storage.is.isContractor}
            forceCreate={!storage.is.isContractor}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Questionnaires"
            pageTitleSingular="questionnaire"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewQuestionnaireDialog ref="newDialog"/>
            <EditQuestionnaireDialog ref="editDialog"/>
            <ProfileQuestionnaireDialog ref="profileDialog"/>

            <NewDocTemplateDialog ref="newTemplateDialog"/>

            <ProfileResponseDialog ref="responseDialog"/>

            <ProfileQuestionnairePDFReader ref="profileQuestionnairePDFReader"/>
            <ProfileResponsePDFReader ref="profileResponsePDFReader"/>
        </APageListReadWrite>;
    }

    //</editor-fold>
}

export default CompleteTab;
