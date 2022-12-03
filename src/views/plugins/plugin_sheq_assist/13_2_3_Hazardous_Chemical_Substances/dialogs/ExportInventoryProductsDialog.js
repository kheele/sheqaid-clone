// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {
    ClearableInput,
    DateRangeInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput,
    SelectChemicalPhysicalStateInput,
    SelectChemicalTypesInput
} from '../../../../../components/inputs';
import {THead} from '../../../../../components/tables';

import InventoryProductRenderRow from "../InventoryProductRenderRow";
import ListPDFReader from '../printers/ListInventoryProductPDFReader';

import {AControls, AExportDialog} from '../../../../../components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Chemical Product';
    titlePlural = 'Chemical Products';

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
            risk_level: ['Low', 'Medium', 'High', 'Very High'],
            is_combustible: ['Yes', 'No'],
            is_flammable: ['Yes', 'No'],
            is_hazardous: ['Yes', 'No'],
            is_stable: ['Yes', 'No']
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
        physical_state: null,
        type: null,
        risk_level: null,
        is_stable: null,
        is_hazardous: null,
        is_combustible: null,
        is_flammable: null,
        // 
        date_range: null
    };
    // </editor-fold>

    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/chemical-inventory/";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHeadFrom">
    renderTHeadFrom() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Product Name</div>
            <div className="td fixed-flex min-w-110">Physical State</div>
            <div className="td fixed-flex min-w-110">Type</div>
            <div className="td">Category</div>
            <div className="td fixed-flex min-w-100">Risk Level</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol) {
        return <InventoryProductRenderRow key={item.id} idx={n} item={item} isExporting
                                          renderActionsCol={renderActionsCol} onClick={onClick}/>;
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
            <SelectChemicalPhysicalStateInput ref="physical_state" name="physical_state" placeholder="Physical State..."
                                              className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectChemicalTypesInput name="type" placeholder="Type..." className="col-lg-12 form-control"
                                      onChange={this.form.onChange}/>
            <ClearableInput ref="risk_level" name="risk_level" type="select" placeholder="Risk Level..."
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.risk_level} returnValue/>
            <ClearableInput name="is_stable" type="select" placeholder="Is Stable?" className="col-lg-12 form-control"
                            onChange={this.form.onChange} values={this.state.lists.is_stable} returnValue/>
            <ClearableInput name="is_hazardous" type="select" placeholder="Is Hazardous?"
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.is_hazardous} returnValue/>
            <ClearableInput name="is_combustible" type="select" placeholder="Is Combustible?"
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.is_combustible} returnValue/>
            <ClearableInput name="is_flammable" type="select" placeholder="Is Flammable?"
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.is_flammable} returnValue/>
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
