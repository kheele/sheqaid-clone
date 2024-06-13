// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {
    ActionsButton,
    ClearableInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectTeamInput
} from 'components/inputs';

import NavItem from "components/navs/NavItem";
import {THead, TRow} from "components/tables";
import APageListReadWrite from "views/APageListReadWrite";
import Popover from "components/popovers/Popover";

// </editor-fold>

@observer
class Dialog extends React.Component {
    pageKey = "HRDocsDialog";
    title = "Signable Documents";

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
        const {list} = this.props;
        if (list) {
            return this.findByIdsEmployees(list.map(({id}) => id));
        }

        const paramsProps = this.props.params || {};

        params = {...params, ...paramsProps};

        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            department_id,
            job_position_id,
            job_category_id,
            team_id,
            supervisor_id,
            name,
            id_or_pass_num,
        } = filterData || {};

        const listByLogged = sockets.of('employees').fn('listByLogged');

        return listByLogged({
            removed: this.removed,
            //
            department_id,
            job_position_id,
            job_category_id,
            team_id,
            supervisor_id,
            name,
            id_or_pass_num,
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
        const permissionKey = "Employees";
        return <Options idx={idx} permissionModKey={permissionKey}>
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
                                   onChange={onChange}/>
            <SelectJobPositionInput name="job_position" placeholder="Job Position..." required className="form-control"
                                    onChange={onChange}/>
            <SelectTeamInput name="team" placeholder="Team..." required className="form-control"
                             onChange={onChange}/>
            <SelectEmployeeInput name="supervisor" placeholder="Supervisor..." required className="form-control"
                                 onChange={onChange}/>
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="id_or_pass_num" type="text" placeholder="ID/Passport No." className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {isConsultant, hasProjects, isContractorView} = storage.is;
        const {filterData} = this.props.params || {};
        const {department_id, job_position_id, job_category_id, team_id} = filterData || {};
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Name</div>
            {!department_id && <div className="td">Department</div>}
            {!job_position_id && <div className="td">Job Position</div>}
            {/*{!job_category_id && <div className="td">Job Category</div>}*/}
            {/*{!team_id && <div className="td">Team</div>}*/}
            {(hasProjects || isContractorView) && <>
                {/*isConsultant && <div className="td sm-hidden">Company Name</div>*/}
                {isContractorView && <div className="td">Company Name</div>}
                {!isContractorView && <div className="td">Project Name</div>}
                <div className="td">Site Name</div>
            </>}
            <div className="td fixed-flex min-w-500">Stats</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const {isConsultant, hasProjects, isContractorView} = storage.is;

        const {filterData} = this.props.params || {};
        const {department_id, job_position_id, job_category_id, team_id} = filterData || {};

        const item = this.refs.root.list[n];
        let {
            id,
            data: {
                created_at, fname, lname, profile_pic,
                department, job_position, team, supervisor,
                client, project, site,
                medical_list_aggregate, leave_list_aggregate, ppe_type_list_aggregate,
                trainer_training_list_aggregate, warning_list_aggregate,
                supervisor_employee_list_aggregate,
            }
        } = item;

        return <TRow key={id}>
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Name</h6>
            </div>

            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                {hasProjects && (!site || !project || (isConsultant && !client)) &&
                    <i className="fa fa-warning" idx={n} onClick={this.onCompleteEmploymentDetailsShowWarningMsg}/>}
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
            {/*<ConfirmDialog ref="removeDialog" onSoftDelete={updateEmployee}/>*/}

            {/*<NewDialog ref="newDialog" path={this.path}/>*/}
            {/*<ProfileDialog ref="profileDialog" path={this.path}/>*/}
            {/*<EditDialog ref="editDialog" path={this.path}/>*/}

            {/*<ProfilePDFReader ref="pdfReader"/>*/}
            {/*<PrintCardsPDFReader ref="printCardsPDFReader"/>*/}

            <Popover ref="popover"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default Dialog;
