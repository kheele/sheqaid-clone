// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Permissions} from 'utils/Utils';
import ADialogTab from "views/ADialogTab";
import {ActionsButton, Button, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import ImportJobCategoriesDialog from "./ImportJobCategoriesDialog";
import NewJobCategoryDialog from "./NewJobCategoryDialog";
import ProfileJobCategoryDialog from "./ProfileJobCategoryDialog";
import EditJobCategoryDialog from "./EditJobCategoryDialog";

import style from "./JobCategoriesDialog.lazy.css";
import AggregateStat from "components/AggregateStat";
import {updateJobCategory} from "mutations/update";
import {Tabs} from "components/tabs";
import ActiveTab from "../ActiveTab";
import RemovedTab from "../RemovedTab";
import {listJobCategory} from "../../../../../../mutations/listByLogged";

// </editor-fold>

@observer
class JobCategoriesDialog extends ADialogTab {
    path;
    pageKey = "JobCategoriesDialog";
    title = "Job Categories";
    titleSingular = "Job Category";
    permissionKey = "Job Categories";
    onUpdate = updateJobCategory;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = props.path + 'job-positions/';

        this.onBuildQuery = this.onBuildQuery.bind(this);

        this.onImport = this.onImport.bind(this);

        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    //<editor-fold desc="onBuildQuery">
    onBuildQuery(filterData = {}) {
        const {
            name,
        } = filterData || {};

        return {
            listByLogged: listJobCategory,
            attrs: {
                name,
                exact_orgs_company: true,
            },
        };
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="actions">
    onImport(e, btn) {
        this.refs.importDialog.open().then(list => {
            this.refs.root.list.push(...list);
        });
    }

    // </editor-fold>

    //<editor-fold desc="renderFuns">
    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        if (isReadonly) return null;
        const {permissions_other} = storage.loggedUser.user.data;
        const permissions_other_JobCategories = (permissions_other || []).find(v => v.key === this.permissionKey);

        return <div className="left-buttons pull-left">
            {Permissions.allow(permissions_other_JobCategories) &&
                <Button className="btn btn-primary pull-right min-w-110" onClick={this.onImport}>
                    Import Job Categories
                </Button>}
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
        </div>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        const {isConsultant} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-50">ID</div>
            <div className="td">Name</div>
            {isConsultant && <div className="td">Company</div>}
            <div className="td fixed-flex min-w-100">Stats</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(item, idx, onClick) {
        const {
            id,
            data: {
                created_at, name,
                company, client, project, site,
                job_position_list_aggregate,
            }
        } = item;

        const {isConsultant} = storage.is;

//        console.log(item)
        return <TRow key={id}>
            <div className="td fixed-flex min-w-50">{id}</div>
            <div className="td">{name || 'N/A'}</div>
            {isConsultant && <div className="td">
                {client ? (client.name || client.data.name) : 'All'}
            </div>}
            <div className="td fixed-flex min-w-100 flex td-stats">
                <StatsPanel item={item}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    // </editor-fold>
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPage">
    renderPage() {
        const {
            onUpdate,
            onBuildQuery,
            titleSingular,
            title,
            permissionKey,
            renderFilterNode,
            renderTHead,
            renderItem
        } = this;

        return <>
            <Tabs
                key="tabs"
                ref="mainTabs"
                permissionKey={permissionKey}
                index={this.state.index}
                onChange={this.onChange}
            >
                <ActiveTab
                    ref="activeTab"
                    onUpdate={onUpdate}
                    onBuildQuery={onBuildQuery}
                    title="Active"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    onSoftDeleteProhibit={this.onSoftDeleteProhibit}
                    renderLeftButtons={this.renderLeftButtons}
                    renderFilterNode={renderFilterNode}
                    renderTHead={renderTHead}
                    renderItem={renderItem}
                    NewDialog={NewJobCategoryDialog}
                    ProfileDialog={ProfileJobCategoryDialog}
                    EditDialog={EditJobCategoryDialog}
                    permissionKey={permissionKey}
                />
                <RemovedTab
                    ref="removedTab"
                    onUpdate={onUpdate}
                    onBuildQuery={onBuildQuery}
                    title="Removed"
                    titleSingular={titleSingular}
                    titlePlural={title}
                    renderFilterNode={renderFilterNode}
                    renderTHead={renderTHead}
                    renderItem={renderItem}
                    ProfileDialog={ProfileJobCategoryDialog}
                    permissionKey={permissionKey}
                />
            </Tabs>

            <ImportJobCategoriesDialog ref="importDialog" path={this.path}/>
        </>;
    }

    //</editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {

    render() {
        const {
            data: {
                job_position_list_aggregate,
            }
        } = this.props.item;

        return <>
            <AggregateStat title="Job Positions" value={job_position_list_aggregate}/>
        </>;
    }
}

// </editor-fold>

export default JobCategoriesDialog;
