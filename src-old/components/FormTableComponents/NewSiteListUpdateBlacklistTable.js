// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectClientInput, SelectProjectInput, SelectSiteInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewSiteListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewSiteListTable";
    title = "Sites";
    style = style;

    renderItem(n, onClick) {
        const {is: {isConsultant}} = storage;
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        if (item && (item.site || item.id)) {
            const {
                id, data = {}
            } = item.site || item;
            const {
                name,
                client = {},
                project = {}
            } = data;
            const {name: c_name, data: c_data = {}} = client;
            const {name: p_name, data: p_data = {}} = project;
            const clientName = c_name || c_data.name;
            const projectName = p_name || p_data.name;

            const tr = <React.Fragment>
                <div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                {isConsultant && <div className="td">{clientName}</div>}
                <div className="td">{projectName}</div>
                <div className="td">{name}</div>
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
            return <TRow key="item-new" className="padding-10 w-full">
                <div className="td flex padding-0 margin-0">
                    {isConsultant && <SelectClientInput
                        ref={this.onSetRef}
                        name="client"
                        placeholder="Company..."
                        group="NewSiteListUpdateBlacklistingTable"
                        required
                        className="form-control"
                        onChange={this.onChange}
                        add={false}
                    />}
                    <SelectProjectInput
                        ref={this.onSetRef}
                        name="project"
                        placeholder="Project..."
                        group="NewSiteListUpdateBlacklistingTable"
                        required
                        className="form-control"
                        onChange={this.onChange}
                        add={false}
                    />
                    <SelectSiteInput
                        ref={this.onSetRef}
                        name="site"
                        placeholder="Add Site..."
                        group="NewSiteListUpdateBlacklistingTable"
                        required
                        className="no-border-radius-r form-control"
                        onChange={this.onChange}
                        isBlacklisting
                        add={false}
                    />
                    <Button
                        idx={n}
                        action="save"
                        className="btn btn-primary fixed-flex w-40 margin-0 no-border-radius-l"
                        onClick={onClick}
                    >
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    renderTHead() {
        const {is: {isConsultant}} = storage;
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            {isConsultant && <div className="td">Company</div>}
            <div className="td">Project</div>
            <div className="td">Site</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}

// </editor-fold>

export default ListTable;