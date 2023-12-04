// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, getRandomRolor} from 'utils/Utils';
import {
    ActionsButton,
    ClearableInput,
    DateRangeInput,
    SelectEmployeeInput,
    SelectJobPositionInput
} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Training Course';
    titlePlural = 'Training Courses';
    
    get excludePDF() {
        return true;
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/05_Trainings/training-registry/";
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            sector_list: ['Chemicals', 'Construction', 'Fire Management', 'Harvesting', 'Manufacturing', 'Mining', 'Silviculture', 'Transport', 'Other'],
            frequency: ['5 Years', '4 Years', '3 Years', '2 Years', 'Annually', 'Bi-Annually', 'Quarterly'],
            provider: ["Internal", "External"].map(text => {
                return {text, value: text, checked: false};
            })
        },
        searchList: []
    };
    @observable
    filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        name: null,
        frequency: null,
        provider: null,
        job_position_id: null,
        sector: null,
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList({isNew, filterData}) {
        const {
            client_id,
            project_id,
            site_id,
            //
            name,
            frequency,
            provider,
            job_position_id,
            sector,
        } = filterData || {};

        const mon = Dates.formatDateSQL(new Date().addMonths(1));
        const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
        const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

        const limit = 50;

        const args = {
            client_id,
            project_id,
            site_id,
            //
            name,
            frequency,
            provider,
            job_position_id,
            sector,
            //
            // limit,
            //
            exact_orgs: true,
        };

        return byLogged(args);
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td">Course</div>
            <div className="td">Job Position(s)</div>
            <div className="td fixed-flex min-w-90">Frequency</div>
            <div className="td fixed-flex min-w-90">Provider</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        const {
            id, data: {created_at, name, job_position_list, frequency, sector_list, provider, client, project, site}
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td">{name}</div>
            <div className="td">{job_position_list.map(({id, name}) => <span className="block-inline">
                    {name}
                </span>
            )}</div>
            <div className="td fixed-flex min-w-90">{frequency}</div>
            <div className="td fixed-flex min-w-90">{provider}</div>
            {renderActionsCol && renderActionsCol(item, n, onClick)}
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>
            <ClearableInput ref="name" name="name" type="text" placeholder="Course" className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <ClearableInput ref="frequency" name="frequency" type="select" placeholder="Frequency..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.frequency} returnValue/>
            <ClearableInput ref="provider" name="provider" type="radio" placeholder="Provider" vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.provider} returnValue/>
            <SelectJobPositionInput ref="job_position_id" name="job_position" type="select" placeholder="Job Position..." required className="col-lg-12 margin-0 form-control" onChange={this.form.onChange}/>
            <ClearableInput ref="sector" name="sector" type="select" placeholder="Sector..." className="col-lg-12 margin-0 form-control" onChange={this.form.onChange} values={this.state.lists.sector_list} returnValue/>
        </React.Fragment>;
    }
    // </editor-fold>
}

export default ExportDialog;
