// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from 'utils/Utils';

import {ATableSavable, TBody, TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="GroupByTBody">
@observer
class GroupByTBody extends ATableSavable {

    @observable selfState = {
        rendered: false
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    @computed get isJobPos() {
        const {state: {groupBy}} = this.props;
        return groupBy === "Job Position";
    }

    toggle() {
        this.selfState.rendered = !this.selfState.rendered;
    }

    close() {
        this.selfState.rendered = false;
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {
            fname,
            lname,
            id_num,
            passport_num,
            sex,
            dob,
            phone,
            email,
            employment_num,
            employment_date,
            job_position,
            department
        } = item;
        const job_category = job_position && job_position.job_category;
        return <TRow key={"item-" + n + new Date().getTime()}>
            <div className="td fixed-flex min-w-95">{employment_num || 'N/A'}</div>
            <div className="td">{lname}</div>
            <div className="td">{fname}</div>
            <div className="td fixed-flex min-w-110">{id_num}</div>
            <div className="td fixed-flex min-w-100">{passport_num}</div>
            <div className="td fixed-flex min-w-60">{sex || 'N/A'}</div>
            <div className="td fixed-flex min-w-90">{Dates.formatDate(dob) || 'N/A'}</div>
            <div className="td">{email || 'N/A'}</div>
            <div className="td fixed-flex min-w-100">{phone || 'N/A'}</div>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(employment_date) || 'N/A'}</div>
            {!this.isJobPos && <div
                className="td padding-l-0">{job_position ? ((job_position.name || job_position) + (job_category ? (" [" + job_category + "]") : "")) : 'N/A'}</div>}
            {this.isJobPos &&
                <div className="td padding-l-0">{department ? (department.name || department) : 'N/A'}</div>}
        </TRow>;
    }

    render() {
        if (!this.selfState.rendered) return null;
        const {parentIdx} = this.props;
        return (<TBody
            key={"GroupByTBody-" + parentIdx + new Date().getTime()}
            ref="body"
            title="Imported Employees"
            className='GroupByTBody'
            renderItem={this.renderItem}
            onClick={this.onClick}
            state={this.state}
            onLoadList={this.onLoadList}/>);
    }
}

// </editor-fold>

export default GroupByTBody;