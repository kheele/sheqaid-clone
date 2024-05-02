// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {
    ClearableInput,
    DateRangeInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput
} from 'components/inputs';
import {THead} from 'components/tables';

import MSDSRenderRow from "../MSDSTab/MSDSRenderRow";
import ListPDFReader from '../printers/ListMSDSPDFReader';

import {AControls, AExportDialog} from 'components/exports/AExportDialog';
import {Dates} from "utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Safety Data Sheet';
    titlePlural = 'Safety Data Sheets';

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
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            risk_level: ['Low', 'Medium', 'High', 'Very High']
        },
        searchList: []
    };
    @observable filterData = {
        //
        client_id: null,
        project_id: null,
        site_id: null,
        //
        category: null,
        manufacturer: null,
        // 
        risk_level: null,
        // 
        date_range: null
    };
    // </editor-fold>

    exportFn = sockets.of('chemicals/sds').fn('export-excel');

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
            category,
            manufacturer,
            //
            risk_level,
            //
            date_range,
        } = filterData || {};

        const listByLogged = sockets.of('chemicals/sds').fn('listByLogged');

        return listByLogged({
            client_id,
            project_id,
            site_id,
            //
            category,
            manufacturer,
            //
            risk_level,
            //
            date_range,
            //
            exact_orgs: true,
            data_export: true,
            //
            limit: 0,
            offset: 0,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Date Identified</div>
            <div className="td">Product Name</div>
            <div className="td fixed-flex min-w-180">Emergency Phone No.</div>
            <div className="td">Category</div>
            <div className="td">Manufacturer</div>
            <div className="td fixed-flex min-w-120">Risk Level</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        return <MSDSRenderRow key={item.id} idx={n} item={item} renderActionsCol={renderActionsCol} onClick={onClick}/>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>
            <SelectChemicalCategoryInput ref="category" name="category" placeholder="Category..."
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectChemicalManufacturerInput ref="manufacturer" name="manufacturer" placeholder="Manufacturer..."
                                             className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="risk_level" name="risk_level" type="select" placeholder="Risk Level..."
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.risk_level} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control"
                            placeholder="Date Identified Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <ListPDFReader ref="pdfReader"/>
        </React.Fragment>;
    }

    // </editor-fold>

}

export default ExportDialog;
