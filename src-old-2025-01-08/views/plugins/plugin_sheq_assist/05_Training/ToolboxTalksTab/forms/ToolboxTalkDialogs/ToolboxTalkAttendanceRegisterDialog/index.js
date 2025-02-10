import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";

import NewDialog from "./NewDialog";
import ProfileDialog from "./ProfileDialog";
import EditDialog from "./EditDialog";

import style from "./ToolboxTalkAttendanceRegisterDialog.lazy.css";

@observer
class ToolboxTalkAttendanceRegisterDialog extends ADialogList {
    path = 'plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/';
    pageKey = "ToolboxTalkAttendanceRegisterDialog";
    title = "Toolbox Talk Attendance Registers";

    constructor(props) {
        super(props);

        this.onDownload = this.onDownload.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onDownload(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];

        progressDialog.open();
        neonBinding.events.emit(this.path + "export-excel", item).then(res => {
            if (!res) {
                infoDialog.open("An error occurred. Please try again");
            } else {
                infoDialog.open(<>
                    <p>Toolbox Talk Attendance Register successfully exported.</p>
                    <p><small>The file will be automatically downloaded</small></p>
                </>);
                //TODO: rename toolbox talk to training meeting / toolbox talk
                saveFileAs(res, `Training-Toolbox-Talks-Attendance-Register_${Dates.formatDate(new Date())}.xlsx`);
            }
        }).finally(() => {
            progressDialog.close();
        });
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Toolbox Talk Attendance Registers";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            <hr/>
            <NavItem action="writable" idx={idx} onClick={this.onDownload} faIconLeft="print" title="Export"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="subject" type="text" placeholder="Subject" className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        return <THead>
            <div className="td">Date Created</div>
            <div className="td">Subject</div>
            <div className="td">Date</div>
            <div className="td">No. Of Attendants</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, subject, date, employee_list, client, project, site}} = item;
        return <TRow key={id}>
            <div className="td">{Dates.formatDate(created_at)}</div>
            <div className="td">{subject}</div>
            <div className="td">{Dates.formatDate(date)}</div>
            <div className="td">{employee_list.length}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        return <APageListReadWrite
            ref="root"
            page={this}
            hasBackBtn={false}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="Toolbox Talk Attendance Register"
            pageTitleSingular="toolbox talk attendance register"
            path={this.path}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>

            <NewDialog ref="newDialog" path={this.path}/>
            <ProfileDialog ref="profileDialog" path={this.path}/>
            <EditDialog ref="editDialog" path={this.path}/>
        </APageListReadWrite>;
    }

}

export default ToolboxTalkAttendanceRegisterDialog;
