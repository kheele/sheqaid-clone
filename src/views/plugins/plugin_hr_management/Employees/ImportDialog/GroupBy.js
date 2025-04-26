// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Table, TBody, THead} from 'components/tables';
import RenderItemGroup from "./RenderItemGroup";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="GroupBy">
@observer
class GroupBy extends React.Component {

    @observable innerRefs = {};
    @observable reload = 0;

    constructor(props) {
        super(props);

        this.onReload = this.onReload.bind(this);
        this.renderItemGroup = this.renderItemGroup.bind(this);
    }

    @computed get isJobPos() {
        const {state: {groupBy}} = this.props;
        return groupBy === "Job Position";
    }

    @computed get groups() {
        const {state: {list}} = this.props;
        let groups;
        if (this.isJobPos) {
            groups = list.groupBy((
                {
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
                }
            ) => {
                if (job_position) {
                    if (job_position.id) {
                        return job_position.name;
                    } else {
                        return job_position.name || job_position;
                    }
                } else {
                    return "N/A";
                }
            });
        } else {
            groups = list.groupBy((
                {
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
                }
            ) => {
                if (department) {
                    if (department.id) {
                        return department.name;
                    } else {
                        return department;
                    }
                } else {
                    return "N/A";
                }
            });
        }

        const groupList = Object.keys(groups).map(k => {
            const list = groups[k];
            return {name: k, list};
        });
        groupList.sortBy('name');
        return groupList;
    }

    get innerRefsList() {
        return Object.values(this.innerRefs);
    }

    onLoadList() {
        return Promise.resolve();
    }

    async onReload() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.reload++;
                setTimeout(resolve, 100);
            });
        });
    }

    renderItemGroup(n, onClick) {
        const {control, path, state} = this.props;

        const {groups} = this;
        const group = groups[n];
        return <RenderItemGroup
            key={"group-" + n + new Date().getTime()}
            ref={ref => this.innerRefs[n] = ref}
            control={control}
            path={path}
            innerRefs={this.innerRefs}
            onReload={this.onReload}
            state={state}
            groups={groups}
            group={group}
            idx={n}
        />;
    }

    render() {
        return <Table key={"Table-" + this.reload} className="w-full min-h-200 margin-0">
            <THead key={"THead-" + this.reload}>
                <div className="td fixed-flex min-w-95">Employee #</div>
                <div className="td">Last Name</div>
                <div className="td">First Name</div>
                <div className="td fixed-flex min-w-110">ID #</div>
                <div className="td fixed-flex min-w-100">Passport #</div>
                <div className="td fixed-flex min-w-60">Gender</div>
                <div className="td fixed-flex min-w-90">DOB</div>
                <div className="td">Email Address</div>
                <div className="td fixed-flex min-w-100">Phone #</div>
                <div className="td fixed-flex min-w-140">Employment Date</div>
                {!this.isJobPos &&
                    <div className="td padding-l-0 padding-r-0 margin-r-10">Job Position [Category]</div>}
                {this.isJobPos && <div className="td padding-l-0 padding-r-0 margin-r-10">Department</div>}
            </THead>
            <TBody key={"TBody-" + this.reload} renderItem={this.renderItemGroup} list={this.groups}
                   onLoadList={this.onLoadList}/>
        </Table>;
    }
}

// </editor-fold>

export default GroupBy;