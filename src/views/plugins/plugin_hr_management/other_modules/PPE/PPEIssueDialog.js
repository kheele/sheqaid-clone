// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {
	Button,
	ClearableInput,
	SelectClientInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput,
	SelectProjectInput,
	SelectSiteInput,
	SelectTeamInput
} from 'components/inputs';

import style from "./PPEIssueDialog.lazy.css";
import {PPEIssueRenderRow} from "./PPEIssueComponents";
import ADialogList from "views/ADialogList";
import NavItem from "components/navs/NavItem";
import {THead} from "components/tables";
import APageListReadWrite from "views/APageListReadWrite";
import {execWhen} from "utils/UtilsFuns";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";
import NewIssuePPEDialog from "./NewIssuePPEDialog";

// </editor-fold>

@observer
class PPEIssueDialog extends ADialogList {
    // <editor-fold defaultstate="collapsed" desc="fields">
    path = "plugin_sheq_assist/employees/ppe/";
    pageKey = "PPEIssueDialog";
    title = "PPE Issue";

    @observable
    state = {
        view: 'Employee',
        expiry_date: 'ALL',
        items: ["Employee", "Team", "Department", "Job Position", "PPE Type"],
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onIssuePPE = this.onIssuePPE.bind(this);
        this.onChangeInternal = this.onChangeInternal.bind(this);

        this.setView = this.setView.bind(this);
        this.onView && (this.onView = this.onView.bind(this));

    }

    // </editor-fold>

    get view() {
        return this.state.view;
    }

    get isEmployee() {
        return this.view === 'Employee';
    }

    // </editor-fold>

    get isTeam() {
        return this.view === 'Team';
    }

    // </editor-fold>

    get isDepartment() {
        return this.view === 'Department';
    }

    //</editor-fold>

    get isJobPosition() {
        return this.view === 'Job Position';
    }

    //</editor-fold>

    get isPPEType() {
        return this.view === 'PPE Type';
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {view, expiry_date} = this.state;
        this.setView({view, expiry_date, load: false});
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {state: {view, expiry_date: expiry_date_top_filter}} = this;
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            client_id,
            project_id,
            site_id,
            //
            ppe_type_list,
            team_list,
            department_list,
            job_position_list,
            employee_list,
        } = filterData || {};

        const loadBy = sockets.of("employees").fn("listByPPEIssue");

        return loadBy({
            view,
            //
            client_id,
            project_id,
            site_id,
            //
            ppe_type_list,
            team_list,
            department_list,
            job_position_list,
            employee_list,
            //
            exact_orgs: true,
            //
            offset: this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //<editor-fold desc="setView">
    async setView({view = 'Employee', expiry_date = 'ALL', load = true}) {
        let ref;
        if (this.refs.viewButtonsRefBox) {
            ref = this.refs.viewButtonsRefBox;
        } else {
            ref = await execWhen(() => this.refs.viewButtonsRefBox);
        }

        const {view: old_view, expiry_date: old_expiry_date,} = this.state;

        console.log('setView', this);
        console.log('setView view', old_view, view);
        console.log('setView expiry_date', old_expiry_date, expiry_date);

        if (old_view !== view || old_expiry_date !== expiry_date) {
            const filterWrapper = await execWhen(() => this.refs.root.refs.filterWrapper);
            if (filterWrapper.isOpen) {
                await filterWrapper.close();
            }
        }

        ref.setView(view);
        this.state.view = view;
        this.state.expiry_date = expiry_date;

        if (load) {
            this.refs.root.load();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(e, el) {
        const {idx} = el.props;
        const {list} = this.refs.root;
        const item = list[idx];
        console.log("list", this.isEmployee, list.slice())
        const dialog = this.refs.root.getDialogByRef('profileDialog');
        if (dialog) {
            if (this.isEmployee) {
                dialog.open(item);
            } else {
                const {data: {employee: employeeItem}} = item;
                dialog.extraProp('activeId', item.id).open(employeeItem);
            }
        }
    }

    onIssuePPE(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.newIssuePPEDialog.open(item);
    }

    //<editor-fold desc="onChangeInternal">
    onChangeInternal(val) {
        const {name, onChange, disableOneChange} = this.props;
        const {list} = this;
        // list.sortBy('key.value');
        // list.sortBy('module.title');
        this.onChange(list, name, this);

        if (disableOneChange) {
            onChange && onChange(toJS(list), name, this);
        } else {
            const {item, action, oldVal, newVal, onComplete} = val;
            onChange && onChange({list: toJS(list), item, action, oldVal, newVal, onComplete}, name, this);
        }
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Signatures
            </Button>
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPEIssue}>
                Export PPE Item
            </Button>
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPEIssue}>
                Export PPE Type
            </Button>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderRightButtons">
    renderRightButtons() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return <div className="left-buttons pull-left">
            <Button className={fontSizeClass + " btn btn-primary pull-right _888"} onClick={this.onViewPPEIssue}>
                Issue PPE
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Create PPE Item
            </Button>
            <Button className="btn btn-primary pull-right" onClick={this.onSignatures}>
                Create PPE Type
            </Button>
        </div>;
    }

    // </editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "PPE";
        return <Options idx={idx} permissionModKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View Employee"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls grid-4 grid-gap-10">
            <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control"
                               onChange={onChange} addButton={false}/>
            <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
                                onChange={onChange} addButton={false}/>
            <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
                             onChange={onChange} addButton={false}/>
            <SelectDepartmentInput name="department_list" type="select_multi" placeholder="Department(s)..."
                                   className="form-control"
                                   onChange={onChange} addButton={false}/>
            <SelectJobPositionInput name="job_position_list" type="select_multi" placeholder="Job Position(s)..."
                                    className="form-control"
                                    onChange={onChange} addButton={false}/>
            <SelectTeamInput name="team_list" type="select_multi" placeholder="Team(s)..." className="form-control"
                             onChange={onChange} addButton={false}/>
            <SelectEmployeeInput name="employee_list" type="select_multi" placeholder="Employee(s)..."
                                 className="form-control" onChange={onChange} addButton={false}/>
            <ClearableInput name="name" type="text" placeholder="PPE Type" className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        const {readonly, disableOneChange} = this.props;
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            <div className="td">Employee</div>
            <div className="td">Job Position</div>
            <div className="td">Department</div>
            <div className="td">Team</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-160"/>
        </THead>;
    }

    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <PPEIssueRenderRow key={item.id} idx={n} item={item} view={this.view} onIssuePPE={this.onIssuePPE}
                                  onView={this.refs.root.onView} onClick={onClick}/>;
    }

    //</editor-fold>

    //<editor-fold desc="renderPage">
    renderPage() {
        const {state, state: {expiry_date}} = this;

        return <>
            <ViewByButtonsBox
                ref="viewButtonsRefBox"
                state={state}
                expiry_date={expiry_date}
                onChange={this.setView}
            />
            <APageListReadWrite
                ref="root"
                page={this}
                hasBackBtn={false}
                createBtnTitle="Create"
                pageId={this.pageKey + '-page'}
                listCountTopTitle="ppe type"
                pageTitleSingular="ppe type"
                onLoadList={this.onLoadList}
                noAnimation={true}
                renderPopoverOptions={this.renderPopoverOptions}
                renderFilterNode={this.renderFilterNode}
                renderTHead={this.renderTHead}
                renderItem={this.renderItem}>
                <NewIssuePPEDialog ref="newIssuePPEDialog"/>

                {/*<NewPPEDialog ref="newDialog" onSetSignatureSettings={this.onSignatures}/>*/}
                {/*<ProfilePPEDialog ref="profileDialog"/>*/}
                {/*<EditPPEDialog ref="editDialog"/>*/}

                {/*<NewPPEItemDialog ref="newItemDialog" onSetSignatureSettings={this.onSignatures}/>*/}
                {/*<ProfilePPEItemDialog ref="profileItemDialog"/>*/}
                {/*<EditPPEItemDialog ref="editItemDialog"/>*/}

                {/*<PPEIssueDialog ref="ppeIssueDialog"/>*/}

                {/*<SignatureDialog ref="signaturesDialog" plugin="plugin_hr_management" module="PPE"/>*/}
            </APageListReadWrite>
        </>;
    }

    //</editor-fold>

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
        const {state: {view, items}, expiry_date, onChange} = this.props;
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
            }} expiry_date={expiry_date} value={view} onChange={onChange} items={items}/>
        </MKBox>
    }
}

// </editor-fold>

export default PPEIssueDialog;
