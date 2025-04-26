import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, ClearableInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import style from "./Main.lazy.css";
import AggregateStat from "components/AggregateStat";
import {listSectors} from "mutations/listByLogged";

@observer
class Main extends React.Component {
    static key = 'Sectors';

    path = "plugin_sheq_assist/sectors/";
    pageKey = "Sectors";

    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        return listSectors({
            name,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        });
    }

    //</editor-fold>

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const permissionKey = "Sectors";
        const {key} = pluginManager.selected;
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Sector Name" className="form-control"
                            onChange={onChange}/>
        </div>;
    }

    renderTHead() {
        const {isConsultant} = storage.is;
        return <THead>
            <div className="td fixed-flex min-w-30">ID</div>
            <div className="td">Date Created</div>
            <div className="td">Sector Name</div>
            {isConsultant && <div className="td">Company</div>}
            <div className="td fixed-flex min-w-100">Stats</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at, name,
                company, client,
                training_course_list_aggregate,
                company_list_aggregate, client_list_aggregate,
            }
        } = item;

        const {isConsultant} = storage.is;

        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{id}</div>
            <div className="td">{Dates.formatDate(created_at)}</div>
            <div className="td">{name}</div>
            {isConsultant && <div className="td">
                {client ? (client.name || client.data.name) : 'All'}
            </div>}
            <div className="td fixed-flex min-w-100 flex td-stats">
                <StatsPanel item={item}/>
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-page"}
            pageTitle="Sectors"
            pageTitleSingular="sector"
            onLoadList={this.onLoadList}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            loadOnScrolled={false}>
            <ConfirmDialog ref="removeDialog"/>

            <NewDialog ref="newDialog"/>
            <ProfileDialog ref="profileDialog"/>
            <EditDialog ref="editDialog"/>
        </APageListReadWrite>;
    }
}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {

    render() {
        const {
            data: {
                training_course_list_aggregate,
                company_list_aggregate, client_list_aggregate,
            }
        } = this.props.item;

        return <>
            <AggregateStat title="Training Courses" value={training_course_list_aggregate}/>
        </>;
    }
}

// </editor-fold>

export default Main;//313, 237
