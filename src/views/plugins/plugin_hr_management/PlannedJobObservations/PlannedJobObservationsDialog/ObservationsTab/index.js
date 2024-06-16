import React from "react";
import {observer} from 'mobx-react';

import style from "./ObservationsTab.lazy.css";
import {observable, toJS} from "mobx";
import NavItem from "components/navs/NavItem";
import {
    ClearableInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectQuestionnaireTemplateInput
} from "components/inputs";
import {THead} from "components/tables";
import APageListReadWrite from "views/APageListReadWrite";
import {EditQuestionnaireDialog, EditResponseDialog, NewQuestionnaireDialog, ProfileResponseDialog} from "./forms";
import Popover from "components/popovers/Popover";
import ObservationTableRow from "./ObservationTableRow";

@observer
class ObservationsTab extends React.Component {
    pageKey = "ObservationsTab";

    @observable
    state = {
        lists: {
            interval: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually'].map(value => {
                return {value, label: value}
            })
        }
    };

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.onCopy = this.onCopy.bind(this);
        this.onStart = this.onStart.bind(this);

//        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="actions">
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list} = this.refs.root;
        const copy = toJS(list[idx]);
        this.refs.copyDialog.open(copy);
    }

    onStart(evt, elem) {
        const {idx, action} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.newDialog.open(item);
    }

    //</editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {item: employee} = this.props;
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
            interval,
            template_id,
            job_position_list,
            employee: employee2,
        } = filterData || {};

        const listByLogged = sockets.of('job-observations').fn('listByLogged');

        return listByLogged({
            employee_id: (employee2 || employee) && (employee || employee2).id,
            //
            name,
            interval,
            template_id,
            job_position_list,
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

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const {renderPopoverOptions} = this.props;
        if (renderPopoverOptions) {
            return renderPopoverOptions(idx, {onView, onEdit, onRemove, Options});
        }
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            <NavItem action="writable" idx={idx} onClick={this.onStart} faIconLeft="plus"
                     title={"Start Job Observation"}/>
        </Options>;
    }

    renderFilterNode(onChange) {
        const listByLogged = sockets.of('job-observations').fn('listTemplatesByLogged');

        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput
                name="interval"
                type="select"
                placeholder="Interval..."
                className="form-control"
                onChange={onChange}
                values={this.state.lists.interval}
                returnValue
            />
            <SelectQuestionnaireTemplateInput
                name="template"
                placeholder="Template..."
                className="form-control"
                byLogged={listByLogged}
                onChange={onChange}
            />
            <SelectJobPositionInput name="job_position_list" type="select_multi" placeholder="Job Position(s)..."
                                    className="form-control" onChange={onChange}/>
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control"
                                 onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {item: employee} = this.props;
        return <THead>
            <div className="td fixed-flex min-w-60">ID</div>
            {/*<div className="td fixed-flex min-w-140">Score</div>*/}
            {!employee && <div className="td">Employee Observed</div>}
            <div className="td">Observer</div>
            <div className="td">Task Observed</div>
            <div className="td fixed-flex min-w-160">Interval</div>
            <div className="td fixed-flex min-w-160">Start Date</div>
            <div className="td fixed-flex min-w-160">Scheduled Date</div>
            <div className="td fixed-flex min-w-160">Next Schedule</div>
            <div className="td fixed-flex min-w-160">Completed</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const {item: employee} = this.props;
        let item = this.refs.root.list[n];
        return <ObservationTableRow key={item.id} idx={n} item={item} employee={employee} onClick={onClick}/>;
    }

    render() {
//        const {permissions_modules, permissions_other} = storage.loggedUser.user.data;
//        const permissions_mod = (permissions_modules || []).find(v => v.key === "__A_COVID_Management");
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");

        const {children, onLoadList, pageId, pageTitle, pageTitleSingular, type, NewDialog} = this.props;
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            // createBtnTitle="Create"
            hasCreateBtn={() => false}
            pageId={pageId}
            pageTitle={pageTitle}
            pageTitleSingular={pageTitleSingular}
            onLoadList={this.onLoadList}
            noAnimation={true}
            onLoaded={this.onLoaded}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
        >
            <NewQuestionnaireDialog ref="copyDialog"/>
            <ProfileResponseDialog ref="profileDialog"/>
            <EditResponseDialog ref="newDialog"/>
            <EditQuestionnaireDialog ref="editDialog"/>
            <Popover key="popover" ref="popover"/>
        </APageListReadWrite>;
    }
}

export default ObservationsTab;
