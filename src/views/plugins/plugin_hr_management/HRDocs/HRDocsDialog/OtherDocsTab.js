// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {ActionsButton, ClearableInput, ProfileField} from 'components/inputs';

import NavItem from "components/navs/NavItem";
import {THead, TRow} from "components/tables";
import APageListReadWrite from "views/APageListReadWrite";
import Popover from "components/popovers/Popover";
import AList from "../../../../AList";
import {renderExpiryDateSpan} from "../../../../../utils/ComponentUtils";
import NewDialog from "./NewDialog";
import ProfileDialog from "./ProfileDialog";
import EditDialog from "./EditDialog";
import ConfirmDialog from "components/dialogs/ConfirmDialog";
import updateDocument from "mutations/all/Document/updateDocument";
import Form from "utils/Form";

// </editor-fold>

@observer
class Dialog extends AList {
    pageKey = "HRDocsDialog";
    title = "Other Documents";
    type = "General Document";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    // componentWillMount() {
    //     style.use();
    // }
    //
    // // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    // componentWillUnmount() {
    //     style.unuse();
    // }
    //
    // // </editor-fold>

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

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        // const permissionKey = "Employees";
        // return <Options idx={idx} permissionModKey={permissionKey}>
        //     <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
        //     <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
        //     <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        // </Options>;
        // const perm = this.notHasWritePermission ? null : this.props.permissionKey;
        return <Options idx={idx}>
            {/*return <Options idx={idx} permissionModKey={perm}>*/}
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {/*{!this.notHasWritePermission && <>*/}
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr/>
            <NavItem action="edit" onClick={this.onUpdateReview} faIconLeft="edit" title="Update Review"/>
            {/*</>*/}
            <hr/>
            <NavItem action="download" onClick={this.onDownload} faIconLeft="download" title="Download"/>
            <NavItem action="save-pdf" onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
            <hr/>
            <NavItem action="share" onClick={this.onShare} faIconLeft="share" title="Share"/>
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
        return <THead>
            <div className="td fixed-flex min-w-30"/>
            <div className="td fixed-flex min-w-50">No.</div>
            <div className="td fixed-flex min-w-80">Code</div>
            <div className="td">Document Name</div>
            {/*<div className="td">Company</div>*/}
            <div className="td fixed-flex min-w-240">Responsible Department</div>
            <div className="td fixed-flex min-w-240">Responsible Person</div>
            <div className="td fixed-flex min-w-80">Revisions</div>
            <div className="td fixed-flex min-w-100">Review Date</div>
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

                doc_version_list,
                latest_version: _latest_version,
            }
        } = item;

        const [latest_version] = _latest_version || [];

        const getFileType = (type) => {
            if (type) return type.toLowerCase();
            // console.log('getFileType', type, doc, doc_old)
        };

        const getFileTypeIcon = (type) => {
            if (type === "Type") return <i className="fa fa-regular fa-file"></i>;
            return <i className="fa fa-solid fa-paperclip"></i>;
        };

        console.log('doc', latest_version.doc);

        return <TRow key={id} className="w-ful">
            <div className="td fixed-flex min-w-30 td-filetype">{getFileTypeIcon(latest_version.type)}</div>
            <div className={"td fixed-flex min-w-50"}>
                <h6 className="xs-shown font-size-13">No.</h6>
                {id}
            </div>
            <div className="td fixed-flex min-w-80">
                <h6 className="xs-shown font-size-13">Code</h6>
                {latest_version.doc_num || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Document Name</h6>
                {title}
            </div>
            {/*<div className="td">*/}
            {/*    <h6 className="xs-shown font-size-13">Company</h6>*/}
            {/*    {client && client.name || company && company.name}*/}
            {/*</div>*/}
            <div className="td fixed-flex min-w-240">
                <h6 className="xs-shown font-size-13">Responsible Department</h6>
                {responsible_department && responsible_department.name || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-240">
                <h6 className="xs-shown font-size-13">Responsible Person</h6>
                {responsible_person ? (responsible_person.lname + ' ' + responsible_person.fname) : 'N/A'}
            </div>
            <div className="td fixed-flex min-w-100">
                <h6 className="xs-shown font-size-13">Revisions</h6>
                {doc_version_list.length}
            </div>
            <div className="td fixed-flex min-w-100">
                <h6 className="xs-shown font-size-13">Review Date</h6>
                {renderExpiryDateSpan(latest_version.expiry)}
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
        return <APageListReadWrite
            ref="root"
            page={this}
            pageId={this.pageKey + "-tab"}
            pageTitle="Signable Documents"
            pageTitleSingular="signable document"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateDocument}/>

            {!this.notHasWritePermission &&
                <NewDialog ref="newDialog" doc_type="General Document" title="General Document" showCategory
                           extraContent={ExtraContent}/>}
            <ProfileDialog ref="profileDialog" doc_type="General Document" title="General Document" showCategory
                           extraContent={ExtraContent}/>
            <EditDialog ref="editDialog" doc_type="General Document" title="General Document" showCategory
                        extraContent={ExtraContent}/>

            {/*<ProfilePDFReader ref="pdfReader"/>*/}
            {/*<PrintCardsPDFReader ref="printCardsPDFReader"/>*/}

            <Popover ref="popover"/>
        </APageListReadWrite>;
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
