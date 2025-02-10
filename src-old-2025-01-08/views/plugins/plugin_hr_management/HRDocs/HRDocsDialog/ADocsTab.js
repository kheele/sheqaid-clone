// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';
import {ActionsButton, ClearableInput, UploadButton} from 'components/inputs';

import NavItem from "components/navs/NavItem";
import {THead, TRow} from "components/tables";
import APageListReadWrite from "views/APageListReadWrite";
import Popover from "components/popovers/Popover";
import AList from "views/AList";
import {renderExpiryDateSpan} from "utils/ComponentUtils";
import NewDialog from "./NewDialog";
import ProfileDialog from "./ProfileDialog";
import EditDialog from "./EditDialog";
import ConfirmDialog from "components/dialogs/ConfirmDialog";
import updateDocument from "mutations/all/Document/updateDocument";
import {execWhen} from "utils/UtilsFuns";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";

// </editor-fold>

@observer
class ADocsTab extends AList {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        view: 'Documents',
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props, style) {
        super(props, style);

        this.onLoadList = this.onLoadList.bind(this);

        this.setView = this.setView.bind(this);

        this.onSendForSigning = this.onSendForSigning.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    @computed get isDocuments() {
        return this.state.view === "Documents";
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {type: doc_type} = this;
        const {page, lastItem, filterData, filtered, isNew} = params;

        const {
            title,
            type,
            internal_or_external,
            category_list,
            category_id,
            employee_list,
            employee_id,
            responsible_person_list,
            responsible_person_id,
            responsible_department_list,
            responsible_department_id,
        } = filterData || {};

        const listByLogged = sockets.of('documents').fn('listByLogged');

        return listByLogged({
            is_template: !this.isDocuments,
            doc_type,
            //
            title,
            type,
            internal_or_external,
            category_list,
            category_id,
            employee_list,
            employee_id,
            responsible_person_list,
            responsible_person_id,
            responsible_department_list,
            responsible_department_id,
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

    //<editor-fold desc="setView">
    async setView({view = 'Documents', load = true}) {
        let ref;
        if (this.refs.viewButtonsRefBox) {
            ref = this.refs.viewButtonsRefBox;
        } else {
            ref = await execWhen(() => this.refs.viewButtonsRefBox);
        }

        ref.setView(view);
        this.state.view = view;

        if (load) {
            this.refs.root.load();
        }
    }

    //</editor-fold>

    onSendForSigning(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const perm = this.notHasWritePermission ? null : this.props.permissionKey;
        return <Options idx={idx} permissionModKey={perm}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {!this.notHasWritePermission && <>
                <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
                <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
                {/*<hr/>*/}
                {/*<NavItem idx={idx} action="edit" onClick={this.onUpdateReview} faIconLeft="edit" title="Update Review"/>*/}
                <hr/>
                <NavItem idx={idx} action="edit" onClick={this.onSendForSigning} faIconLeft="edit"
                         title="Send For Signing"/>
            </>}
            {/*<hr/>*/}
            {/*<NavItem idx={idx} action="download" onClick={this.onDownload} faIconLeft="download" title="Download"/>*/}
            {/*<NavItem idx={idx} action="save-pdf" onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o"*/}
            {/*         title="Save As PDF"/>*/}
            {/*<hr/>*/}
            {/*<NavItem idx={idx} action="share" onClick={this.onShare} faIconLeft="share" title="Share"/>*/}
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            {/*<ClearableInput name="type" type="radio" placeholder="Document Type" className="form-control fixed-flex min-w-355" onChange={onChange} values={this.state.lists.types}/>*/}
            <ClearableInput name="title" type="text" placeholder="Name of Document" className="form-control"
                            onChange={onChange}/>
            {/*<ClearableInput name="owner" type="text" placeholder="Owner" className="form-control" onChange={onChange}/>*/}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        let tr = <>
            <div className="td fixed-flex min-w-30"/>
            <div className="td fixed-flex min-w-50">No.</div>
            <div className="td fixed-flex min-w-80">Code</div>
            <div className="td">Document Name</div>
            {/*<div className="td">Company</div>*/}
            <div className="td">Responsible Department</div>
            <div className="td">Responsible Person</div>
        </>;
        if (this.isDocuments) {
            tr = <>
                {tr}
                <div className="td fixed-flex min-w-140">Revisions</div>
                <div className="td fixed-flex min-w-120">Review Date</div>
            </>;
        }
        return <THead>
            {tr}
            <div className="td fixed-flex min-w-220">Document</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at,
                // doc,
                // doc_old,

                company,
                client,
                project,
                site,
                internal_or_external,
                title,
                desc,
                responsible_department,
                responsible_person,
                contractor,
                contractor_site,
                contractor_user,
                employee,
                doc_type,
                category,
                removed,

                doc_version_list = [],
                latest_version: _latest_version,
                signable_doc_template_list,
            }
        } = item;

        const [latest_version] = _latest_version || [];
        const {doc: doc1, doc_docs_id, doc_num, type, expiry} = latest_version || {};
        const [signable_doc_template] = signable_doc_template_list || [];
        const {doc: doc2} = signable_doc_template || {};
        const doc = doc1 || doc2;

        const getFileType = (type) => {
            if (type) return type.toLowerCase();
            // console.log('getFileType', type, doc, doc_old)
        };

        const getFileTypeIcon = (type) => {
            if (type === "Type") return <i className="fa fa-regular fa-file"></i>;
            return <i className="fa fa-solid fa-paperclip"></i>;
        };

        console.log('doc', doc);

        let tr = <>
            <div className="td fixed-flex min-w-30 td-filetype">{getFileTypeIcon(type)}</div>
            <div className={"td fixed-flex min-w-50"}>
                <h6 className="xs-shown font-size-13">No.</h6>
                {id}
            </div>
            <div className="td fixed-flex min-w-80">
                <h6 className="xs-shown font-size-13">Code</h6>
                {doc_num || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Document Name</h6>
                {title}
            </div>
            {/*<div className="td">*/}
            {/*    <h6 className="xs-shown font-size-13">Company</h6>*/}
            {/*    {client && client.name || company && company.name}*/}
            {/*</div>*/}
            <div className="td">
                <h6 className="xs-shown font-size-13">Responsible Department</h6>
                {responsible_department && responsible_department.name || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Responsible Person</h6>
                {responsible_person ? (responsible_person.lname + ' ' + responsible_person.fname) : 'N/A'}
            </div>
        </>;

        if (this.isDocuments) {
            tr = <>
                {tr}
                <div className="td fixed-flex min-w-140">
                    <h6 className="xs-shown font-size-13">Revisions</h6>
                    {doc_version_list.length}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Review Date</h6>
                    {renderExpiryDateSpan(expiry)}
                </div>
            </>;
        }

        return <TRow key={id} className="w-full">
            {tr}
            <div className="td fixed-flex min-w-220">
                <h6 className="xs-shown font-size-13">Document</h6>
                {doc && <UploadButton
                    name="doc"
                    type={['PDF', 'Word', 'Excel']}
                    defaultValue={doc}
                    showOnlyIcon
                    readonly
                    className="col-lg-12 hor-center"
                />}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    // </editor-fold>
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {state, state: {expiry_date}} = this;

        return <>
            <ViewByButtonsBox
                ref="viewButtonsRefBox"
                state={state}
                titleSingular="Templates"
                onChange={this.setView}
            />
            <APageListReadWrite
                ref="root"
                page={this}
                pageId={this.pageKey + "-tab"}
                pageTitle={this.title}
                pageTitleSingular={this.pageTitleSingular}
                onLoadList={this.onLoadList}
                noAnimation={true}
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                renderTHead={this.renderTHead}
                renderItem={this.renderItem}
            >
                <ConfirmDialog ref="removeDialog" onSoftDelete={updateDocument}/>

                {!this.notHasWritePermission &&
                    <NewDialog
                        ref="newDialog"
                        module={this.module}
                        doc_type={this.doc_type}
                        title={this.title}
                        extraContent={this.extraContent}
                        showCategory={this.showCategory}
                    />
                }
                <ProfileDialog
                    ref="profileDialog"
                    module={this.module}
                    doc_type={this.doc_type}
                    title={this.title}
                    extraContent={this.extraContent}
                    showCategory={this.showCategory}
                />
                <EditDialog
                    ref="editDialog"
                    module={this.module}
                    doc_type={this.doc_type}
                    title={this.title}
                    extraContent={this.extraContent}
                    showCategory={this.showCategory}
                />
                <Popover ref="popover"/>
            </APageListReadWrite>
        </>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.setView = this.setView.bind(this);
    }

    // </editor-fold>

    setView(value) {
        execWhen(() => this.viewButtonsRef).then(ref => {
            ref.setView(value);
        });
    }

    render() {
        const {state: {view}, titleSingular, onChange} = this.props;
        return <MKBox
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin='10px 0 0px'
            padding="0 0 10px"
            borderBottom="2px solid #ebebeb"
        >
            <ViewByButtons ref={ref => {
                this.viewButtonsRef = ref;
            }} text="Documents" value={view} name={titleSingular} replaceBy onChange={onChange}/>
        </MKBox>
    }
}

// </editor-fold>

export default ADocsTab;
