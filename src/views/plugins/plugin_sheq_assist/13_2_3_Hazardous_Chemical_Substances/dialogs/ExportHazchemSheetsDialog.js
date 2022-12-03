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

import HazchemSheetRenderRow from "../HazchemSheetRenderRow";
import ListPDFReader from '../printers/ListHazchemSheetPDFReader';

import {AControls, AExportDialog} from '../../../../../components/exports/AExportDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends AExportDialog {
    titleSingular = 'Hazchem Sheet';
    titlePlural = 'Hazchem Sheets';

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
        physical_state: null, 
        type: null,
        // 
        category: null,
        manufacturer: null,
        //
        risk_level: null,
        // 
        date_range: null
    };
    // </editor-fold>
    
    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/";

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
            <div className="td">Category</div>
            <div className="td">Manufacturer</div>
            <div className="td fixed-flex min-w-120">Physical State</div>
            <div className="td">Type</div>
            <div className="td fixed-flex min-w-120">Risk Level</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-70"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemFrom">
    renderItemFrom(item, n, onClick, renderActionsCol){
        return <HazchemSheetRenderRow key={item.id} idx={n} item={item} renderActionsCol={renderActionsCol} onClick={onClick}/>;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderFields">
    get renderFields() {
        return <React.Fragment>    
            <SelectChemicalPhysicalStateInput ref="physical_state" name="physical_state" placeholder="Physical State..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectChemicalTypesInput ref="type" name="type" placeholder="Type..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <SelectChemicalCategoryInput ref="category" name="category" placeholder="Category..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <SelectChemicalManufacturerInput ref="manufacturer" name="manufacturer" placeholder="Manufacturer..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <ClearableInput ref="risk_level" name="risk_level" type="select" placeholder="Risk Level..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level} returnValue/>
            <hr className="pull-left no-border bg-ddd h-2"/>
            <DateRangeInput ref="date_range" name="date_range" className="col-lg-12 h-105 grid-6 margin-0 form-control" placeholder="Date Identified Range" onChange={this.form.onChange}>
                <label className="min-w-65">From</label>
                <label className="min-w-50">To</label>
            </DateRangeInput>
            <ListPDFReader ref="pdfReader"/>
        </React.Fragment>;
    }
    // </editor-fold>
    
}

export default ExportDialog;
