// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectProjectInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewProjectListTable.lazy.css";
import NewRow from "./NewRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewProjectListTable";
    title = "Projects";
    style = style;

    renderItem(n, onClick) {
        const {is: {isConsultant}} = storage;
        const {readonly, renderTable, isContractor, renderActions} = this.props;
        const item = this.state.list[n];
        if (item && (item.project || item.id)) {
            let {
                id, name, client, project, data = {}
            } = item.project || item;

            client = client || data.client;
            project = project || data.project;
            const clientName = client && (client.name || client.data.name);
            const projectName = project && (project.name || project.data.name);

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                {(isConsultant || isContractor) && <div className="td">{clientName}</div>}
                <div className="td">{projectName}</div>
                <div className="td">{name || data.name}</div>
                {isFunction(renderActions) && renderActions(item, n)}
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;

            return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return <NewRow idx={n} onClick={onClick}>
                <SelectProjectInput
                    ref={this.onSetRef}
                    name="project"
                    placeholder="Add Project..."
                    required
                    className="no-border-radius-r form-control"
                    onChange={this.onChange}
                />
            </NewRow>;
        }
    }

    renderTHead() {
        const {is: {isConsultant}} = storage;
        const {readonly, isContractor} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            {(isConsultant || isContractor) && <div className="td">Company</div>}
            <div className="td">Project</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;