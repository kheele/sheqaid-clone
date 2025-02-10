// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {
    ActionsButton,
    ClearableInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTeamInput,
    UploadButton,
} from 'components/inputs';

import NavItem from "components/navs/NavItem";
import {THead, TRow} from "components/tables";
import APageListReadWrite from "views/APageListReadWrite";
import Popover from "components/popovers/Popover";
import {execWhen} from "utils/UtilsFuns";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";
import ProfileSignableDocDialog from "./ProfileSignableDocDialog";

// </editor-fold>

@observer
class Dialog extends React.Component {
    pageKey = "HRDocsDialog";
    title = "Signable Documents";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        view: 'Documents',
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.setView = this.setView.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    // </editor-fold>

    // // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    // componentWillUnmount() {
    //     style.unuse();
    // }
    //
    // // </editor-fold>

    @computed get isDocuments() {
        return this.state.view === "Documents";
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {state: {view}} = this;
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        const listByLogged = sockets.of('doc-signing-settings/api/docuseal/templates').fn('listByLogged');

        return listByLogged({
            view,
            //
            name,
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

    // <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const perm = "_00_Document_and_Record_Control";
        // return <Options idx={idx}>
        return <Options idx={idx} permissionModKey={perm}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectDepartmentInput name="department" placeholder="Department..." required className="form-control"
                                   onChange={onChange} addButton={false}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." required className="form-control"
                                    onChange={onChange} addButton={false}/>
            <SelectTeamInput name="team" placeholder="Team..." required className="form-control"
                             onChange={onChange} addButton={false}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." required className="form-control"
                                 onChange={onChange} addButton={false}/>
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="id_or_pass_num" type="text" placeholder="ID/Passport No." className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        if (this.isDocuments) {
            return <THead>
                <div className="td fixed-flex min-w-60">ID</div>
                <div className="td fixed-flex min-w-280">Name</div>
                <div className="td fixed-flex min-w-260">Module</div>
                <div className="td fixed-flex min-w-260">Document Type</div>
                <div className="td">Submitters</div>
                <div className="td fixed-flex min-w-180">No. Of Submissions</div>
                <div className="td fixed-flex min-w-100">Preview</div>
                <div className="td fixed-flex min-w-200">Document</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
            </THead>;
        }
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td fixed-flex min-w-280">Name</div>
            <div className="td fixed-flex min-w-260">Module</div>
            <div className="td fixed-flex min-w-260">Document Type</div>
            <div className="td">Submitters</div>
            <div className="td fixed-flex min-w-100">Preview</div>
            <div className="td fixed-flex min-w-200">Document</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        let {
            id,
            data: {
                created_at,
                name,
                doc,
                preview_image_url,
                module,
                doc_type,
                employee_submitter_list,
                employee_submission_list,
                employee_submitter_list_aggregate,
                employee_submission_list_aggregate,
            }
        } = item;

        if (this.isDocuments) {
            return <TRow key={id} className="w-full">
                <div className="td fixed-flex min-w-60">{id}</div>
                <div className="td fixed-flex min-w-280">{name}</div>
                <div className="td fixed-flex min-w-260">{module && module.title}</div>
                <div className="td fixed-flex min-w-260">{doc_type}</div>
                <div className="td">{(employee_submitter_list || []).map(v => v.employee.full_name).join(', ')}</div>
                <div className="td fixed-flex min-w-180">{employee_submission_list_aggregate.aggregate.count}</div>
                <div className="td fixed-flex min-w-100">
                    {preview_image_url && <img src={preview_image_url} className="h-full"/>}
                </div>
                <div className="td fixed-flex min-w-200">
                    {doc && <UploadButton
                        defaultValue={doc}
                        showOnlyIcon
                        readonly
                        className="flex min-w-180"
                    />}
                </div>
                <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>
            </TRow>;
        }

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td fixed-flex min-w-280">{name}</div>
            <div className="td fixed-flex min-w-260">{module && module.title}</div>
            <div className="td fixed-flex min-w-260">{doc_type}</div>
            <div className="td">{(employee_submitter_list || []).map(v => v.employee.full_name).join(', ')}</div>
            <div className="td fixed-flex min-w-100">
                {preview_image_url && <img src={preview_image_url} className="h-full"/>}
            </div>
            <div className="td fixed-flex min-w-200">
                {doc && <UploadButton
                    defaultValue={doc}
                    showOnlyIcon
                    readonly
                    className="flex min-w-180"
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
                pageTitle="Signable Documents"
                pageTitleSingular="signable document"
                onLoadList={this.onLoadList}
                noAnimation={true}
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                renderTHead={this.renderTHead}
                renderItem={this.renderItem}>
                {/*<ConfirmDialog ref="removeDialog" onSoftDelete={updateEmployee}/>*/}

                {/*<NewDialog ref="newDialog"/>*/}
                <ProfileSignableDocDialog ref="profileDialog"/>
                {/*<EditDialog ref="editDialog"/>*/}

                {/*<ProfilePDFReader ref="pdfReader"/>*/}
                {/*<PrintCardsPDFReader ref="printCardsPDFReader"/>*/}

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

export default Dialog;
