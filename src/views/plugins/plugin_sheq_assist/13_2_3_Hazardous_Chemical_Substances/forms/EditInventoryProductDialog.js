// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {execWhen, ShouldUpdate} from "utils/Utils";
import {TinyMCE} from 'components/documents';
import {
    ClearableInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput,
    SelectChemicalPhysicalStateInput,
    SelectChemicalTypesInput,
    SelectClientInput,
    SelectHazchemSheetInput,
    SelectProjectInput,
    SelectSDSProductInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Fragment, Row} from 'components/FormComponents';
import {NewChemicalStockItemListTable, NewPPEItemListTable} from 'components/FormTableComponents';
import {AEditDialog} from 'components/dialogs';

import {changeColors} from '../dialogs/Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./EditInventoryProductDialog.lazy.css";
import NewChemicalSupplierListTable from "../../../../../components/FormTableComponents/NewChemicalSupplierListTable";
import updateChemicalSDS from "../../../../../mutations/all/Chemicals/ChemicalSDS/updateChemicalSDS";
import updateChemicalProduct from "../../../../../mutations/all/Chemicals/ChemicalProduct/updateChemicalProduct";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditInventoryProductDialog extends AEditDialog {
    pageKey = "EditInventoryProductDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Chemical Product";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/chemical-inventory/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            //1
            emergency_phone_nums: [],
            //2
            location_where_product_is_used: [],
            is_stable: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            is_cool_well_ventilated_area: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            heat_sparks_static_flames: [],
            spillage_control: [],
            other_special_info: [],
            //3
            compatible_with_list: [],
            incompatible_with_list: [], 
            //4
            risk_level: ['Low', 'Medium', 'High', 'Very High'].map(text => {
                return {text, value: text};
            }),   
            //5
            is_combustible: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            is_flammable: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            flammability_class: [
                {text: <div><b>IA</b> <small><i>(Liquids that have a flash point below 73&deg;F(22.8&deg;C) and a boiling point below 100&deg;F(37.8&deg;C))</i></small></div>, value: 'IA'}, 
                {text: <div><b>IB</b> <small><i>(Liquids that have a flash point below 73&deg;F(22.8&deg;C) and a boiling point at or above 100&deg;F(37.8&deg;C))</i></small></div>, value: 'IB'}, 
                {text: <div><b>IC</b> <small><i>(Liquids that have a flash point at or above 73&deg;F(22.8&deg;C) but below 100&deg;F(37.8&deg;C))</i></small></div>, value: 'IC'}, 
                {text: <div><b>II</b> <small><i>(Liquids that have a flash point at or above 100&deg;F(37.8&deg;C) and below 140&deg;F(60&deg;C))</i></small></div>, value: 'II'}, 
                {text: <div><b>IIIA</b> <small><i>(Liquids that have a flash point at or above 140&deg;F(60&deg;C) but below 200&deg;F(93&deg;C))</i></small></div>, value: 'IIIA'}
            ],
            //6
            fire_fighting_foam: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            fire_fighting_dcp: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            fire_fighting_co2: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            fire_fighting_water: ['Cooling', 'Fog', 'Spray', 'Yes', 'No'],
            fire_fighting_sand: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            fire_fighting_other: [],
            //7
            is_hazardous: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            hazard_class_list: ['Explosive', 'Oxidising', 'Flammable', 'Corrosive', 'Poisonous', 'Harmful/Irritant', 'Habit Forming', 'Radio Active'].map(text => {
                return {text, value: text, checked: false};
            }),
            //8
            has_sds: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            //9
            has_hazchem_sheet: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            //10
            has_risk_assessment: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }),
            //13
            stock_is_clearly_labeled: [],
            stock_storage_location: [],
            stock_unit: []
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("is_hazardous", this.onChangeIsHazardous.bind(this));
        this.form.addChangeOne("has_sds", this.onChangeHasSDS.bind(this));
        this.form.addChangeOne("has_hazchem_sheet", this.onChangeHasHazchemSheet.bind(this));
        this.form.addChangeOne("has_risk_assessment", this.onChangeHasRiskAssessment.bind(this));
        this.form.addChangeOne("risk_level", this.onChangeRiskLevel.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange">
    // <editor-fold defaultstate="collapsed" desc="onChangeIsHazardous">
    onChangeIsHazardous(el, val) {
        execWhen(() => this.refs.hazardous_details_sec).then(ref => {
            if(val === 'Yes') {
                ref.show();
            } else {
                ref.hide();
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeHasSDS">
    onChangeHasSDS(el, val) {
        execWhen(() => this.refs.sds_details_sec).then(ref => {
            if(val === 'Yes') {
                ref.show();
            } else {
                ref.hide();
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeHasHazchemSheet">
    onChangeHasHazchemSheet(el, val) {
        execWhen(() => this.refs.hazchem_sheet_details_sec).then(ref => {
            if(val === 'Yes') {
                ref.show();
            } else {
                ref.hide();
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeHasRiskAssessment">
    onChangeHasRiskAssessment(el, val) {
        execWhen(() => this.refs.risk_assessment_details_sec).then(ref => {
            if(val === 'Yes') {
                ref.show();
            } else {
                ref.hide();
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeRiskLevel">
    onChangeRiskLevel(el, risk_level) {
        const {props: {dialog}} = this;
        changeColors(dialog, risk_level);
    }
    // </editor-fold>
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        const {isConsultant} = storage.is;

        if(idx === 0) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Product Name is required');
                return;
            }        
            if (!form.isValid('physical_state')) {
                infoDialog.open('Physical State is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isConsultant} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }       
        if (!form.isValid('name')) {
            infoDialog.open('Product Name is required');
            return;
        }        
        if (!form.isValid('physical_state')) {
            infoDialog.open('Physical State is required');
            return;
        }
        
        const {
            //0
            client, project, site,
            //1
            name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
            category, physical_state, type,
            application_or_use,
            supplier_list,
            emergency_phone_nums,
            //2
            location_where_product_is_used, process_where_product_is_used,
            is_stable, is_cool_well_ventilated_area, heat_sparks_static_flames, spillage_control, other_special_info,
            //3
            compatible_with_list,
            incompatible_with_list,
            //4
            risk_level,
            //5
            is_combustible,
            is_flammable,
            flammability_combustibility_class,
            //6
            fire_fighting_foam,
            fire_fighting_dcp,
            fire_fighting_co2,
            fire_fighting_sand,
            fire_fighting_water,
            fire_fighting_other,
            //7
            is_hazardous,
            hazard_class_list,
            //8
            has_sds, sds, sds_doc, sds_date,
            //9
            has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc, hazchem_sheet_date,
            //10
            has_risk_assessment, risk_assessment_doc, risk_assessment_date,
            //11
            ppe_list,
            //12
            action_or_comments,
            //13
            chemical_stock_list
        } = form.data;
        const data = {};
        
        //0
        if(isConsultant) {
            ShouldUpdate.checkClient(data, old_data, client);
        }
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        //1
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, common_names, 'common_names');
        ShouldUpdate.check(data, old_data, chemical_name, 'chemical_name');
        ShouldUpdate.check(data, old_data, empirical_formula, 'empirical_formula');
        ShouldUpdate.check(data, old_data, un_num, 'un_num');
        ShouldUpdate.check(data, old_data, cas_num, 'cas_num');
        ShouldUpdate.check(data, old_data, concentration, 'concentration');
        ShouldUpdate.check(data, old_data, category, 'category');
        ShouldUpdate.check(data, old_data, physical_state, 'physical_state');
        ShouldUpdate.check(data, old_data, type, 'type');
        ShouldUpdate.check(data, old_data, application_or_use, 'application_or_use');
        // ShouldUpdate.check(data, old_data, supplier_list, 'supplier_list');
        ShouldUpdate.checkListToJS(data, old_data, emergency_phone_nums, 'emergency_phone_nums');
        
        //2
        ShouldUpdate.checkListToJS(data, old_data, location_where_product_is_used, 'location_where_product_is_used');
        ShouldUpdate.check(data, old_data, process_where_product_is_used, 'process_where_product_is_used');
        ShouldUpdate.check(data, old_data, is_stable, 'is_stable');
        ShouldUpdate.check(data, old_data, is_cool_well_ventilated_area, 'is_cool_well_ventilated_area');
        ShouldUpdate.checkListToJS(data, old_data, heat_sparks_static_flames, 'heat_sparks_static_flames');
        ShouldUpdate.checkListToJS(data, old_data, spillage_control, 'spillage_control');
        ShouldUpdate.checkListToJS(data, old_data, other_special_info, 'other_special_info');
        
        //3
        ShouldUpdate.checkListToJS(data, old_data, compatible_with_list, 'compatible_with_list');
        ShouldUpdate.checkListToJS(data, old_data, incompatible_with_list, 'incompatible_with_list');
        
        //4
        ShouldUpdate.check(data, old_data, risk_level, 'risk_level');
        
        //5
        ShouldUpdate.check(data, old_data, is_combustible, 'is_combustible');
        ShouldUpdate.check(data, old_data, is_flammable, 'is_flammable');
        ShouldUpdate.check(data, old_data, flammability_combustibility_class, 'flammability_combustibility_class');
        
        //6
        ShouldUpdate.check(data, old_data, fire_fighting_foam, 'fire_fighting_foam');
        ShouldUpdate.check(data, old_data, fire_fighting_dcp,  'fire_fighting_dcp');
        ShouldUpdate.check(data, old_data, fire_fighting_co2, 'fire_fighting_co2');
        ShouldUpdate.check(data, old_data, fire_fighting_sand,  'fire_fighting_sand');
        ShouldUpdate.checkListToJS(data, old_data, fire_fighting_water, 'fire_fighting_water');
        ShouldUpdate.checkListToJS(data, old_data, fire_fighting_other,  'fire_fighting_other');
        
        //7
        ShouldUpdate.check(data, old_data, is_hazardous, 'is_hazardous');
        ShouldUpdate.checkBox(data, old_data, hazard_class_list,  'hazard_class_list');
        
        //8
        ShouldUpdate.check(data, old_data, has_sds, 'has_sds');
        ShouldUpdate.checkSDS(data, old_data, sds,  'sds');
        ShouldUpdate.checkFile(data, old_data, sds_doc,  'sds_doc');
        ShouldUpdate.checkDate(data, old_data, sds_date,  'sds_date');
        
        //9
        ShouldUpdate.check(data, old_data, has_hazchem_sheet, 'has_hazchem_sheet');
        ShouldUpdate.checkHazchemSheet(data, old_data, hazchem_sheet,  'hazchem_sheet');
        ShouldUpdate.checkFile(data, old_data, hazchem_sheet_doc,  'hazchem_sheet_doc');
        ShouldUpdate.checkDate(data, old_data, hazchem_sheet_date,  'hazchem_sheet_date');
        
        //10
        ShouldUpdate.check(data, old_data, has_risk_assessment, 'has_risk_assessment');
        ShouldUpdate.checkFile(data, old_data, risk_assessment_doc,  'risk_assessment_doc');
        ShouldUpdate.checkDate(data, old_data, risk_assessment_date,  'risk_assessment_date');
        
        //11
        ShouldUpdate.checkPPEList(data, old_data, ppe_list, 'ppe_list');
        
        //12
        ShouldUpdate.check(data, old_data, action_or_comments, 'action_or_comments');
        
        //13
        ShouldUpdate.checkChemicalStockList(data, old_data, chemical_stock_list, 'chemical_stock_list');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateChemicalProduct({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            progressDialog.close();
        });
    }
    // </editor-fold>
    
    get getSDSAttached() {
        let {props: {dialog}} = this;
        return dialog.extraProp('sds_attached');
    }
    
    get getHazchemSheetAttached() {
        let {props: {dialog}} = this;
        return dialog.extraProp('hazchem_sheet_attached');
    }
    
    get getRAAttached() {
        let {props: {dialog}} = this;
        return dialog.extraProp('ra_attached');
    }
    
    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    //0
                    client, project, site,
                    //1
                    name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
                    category, physical_state, type,
                    application_or_use,
                    supplier_list,
                    emergency_phone_nums,
                    //2
                    location_where_product_is_used, process_where_product_is_used,
                    is_stable, is_cool_well_ventilated_area, heat_sparks_static_flames, spillage_control, other_special_info,
                    //3
                    compatible_with_list,
                    incompatible_with_list,
                    //4
                    risk_level,
                    //5
                    is_combustible,
                    is_flammable,
                    flammability_combustibility_class,
                    //6
                    fire_fighting_foam,
                    fire_fighting_dcp,
                    fire_fighting_co2,
                    fire_fighting_sand,
                    fire_fighting_water,
                    fire_fighting_other,
                    //7
                    is_hazardous,
                    hazard_class_list,
                    //8
                    has_sds, sds, sds_doc, sds_date,
                    //9
                    has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc, hazchem_sheet_date,
                    //10
                    has_risk_assessment, risk_assessment_doc, risk_assessment_date,
                    //11
                    ppe_list,
                    //12
                    action_or_comments,
                    //13
                    chemical_stock_list
                }
            },
            getSDSAttached, getRAAttached, getHazchemSheetAttached
        } = this;
        
        const {isConsultant, isNoProjects} = storage.is;
        
        return <FormControls>
            {!isNoProjects && <Row 
                rendered  
                active={!getSDSAttached && !getRAAttached && !getHazchemSheetAttached}
                idx={0}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row 
                rendered 
                active={isNoProjects && (!getSDSAttached && !getRAAttached && !getHazchemSheetAttached)}
                idx={1}
                title="1. Product Details" 
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen} 
                onFormBack={!isNoProjects && onFormBack} 
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 padding-0 pull-left">Product Identification</label>
                <ClearableInput name="name" type="text" placeholder="Product Name" defaultValue={name} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="common_names" type="text" placeholder="Common Names / Synonyms" defaultValue={common_names} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="chemical_name" type="text" placeholder="Chemical Name" defaultValue={chemical_name} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="empirical_formula" type="text" placeholder="Empirical Formula" defaultValue={empirical_formula} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="un_num" type="text" placeholder="UN Number" defaultValue={un_num} required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="cas_num" type="text" placeholder="CAS Number" defaultValue={cas_num} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="concentration" type="text" placeholder="Concentration" defaultValue={concentration} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                
                <hr className="col-lg-12 margin-t-5 margin-b-10 margin-r-5"/>
                
                <SelectChemicalCategoryInput name="category" placeholder="Category..." defaultValue={category} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <SelectChemicalPhysicalStateInput name="physical_state" placeholder="Physical State..." defaultValue={physical_state} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <SelectChemicalTypesInput name="type" placeholder="Type..." defaultValue={type} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                <ClearableInput name="application_or_use" type="textarea" placeholder="Application / Use" defaultValue={application_or_use} className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                <NewChemicalSupplierListTable ref="supplier_list" name="supplier_list" defaultValue={[...(supplier_list || []), null]} className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                <ClearableInput name="emergency_phone_nums" type="select_multi" placeholder="Emergency Phone Numbers..." defaultValue={emergency_phone_nums} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.emergency_phone_nums} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Further Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="location_where_product_is_used" type="select_multi" placeholder="Location Where Product Is Used..." defaultValue={location_where_product_is_used} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.location_where_product_is_used} add returnValue/>
                <ClearableInput name="process_where_product_is_used" type="textarea" placeholder="Process Where Product Is Used" defaultValue={process_where_product_is_used} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                
                <hr className="col-lg-12 margin-t-5 margin-b-10 margin-r-5"/>
            
                <ClearableInput name="is_stable" type="radio" placeholder="Is Stable?" defaultValue={is_stable} vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_stable} returnValue/>
                <ClearableInput name="is_cool_well_ventilated_area" type="radio" placeholder="Requires Cool, Well-Ventilated Area?" defaultValue={is_cool_well_ventilated_area} vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_cool_well_ventilated_area} returnValue/>
                <ClearableInput name="heat_sparks_static_flames" type="select_multi" placeholder="Heat, Sparks, Static, Flames..." defaultValue={heat_sparks_static_flames} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.heat_sparks_static_flames} add returnValue/>
                <ClearableInput name="spillage_control" type="select_multi" placeholder="Spillage Control..." defaultValue={spillage_control} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.spillage_control} add returnValue/>
                <ClearableInput name="other_special_info" type="select_multi" placeholder="Other Special Info..." defaultValue={other_special_info} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.other_special_info} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Product Compatibility" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="compatible_with_list" type="select_multi" placeholder="Compatible With..." defaultValue={compatible_with_list} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.compatible_with_list} add returnValue/>
                <ClearableInput name="incompatible_with_list" type="select_multi" placeholder="Incompatible With..." defaultValue={incompatible_with_list} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.incompatible_with_list} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. Risk Level / Class" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="risk_level" type="radio" placeholder="Risk Level" defaultValue={risk_level} className="col-lg-9 pull-left-1_5 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level}/>
                <p className="hor-center text-center padding-t-10 margin-t-20 w-full"><b>Please refer to the diagram below</b></p>
                <img src={riskLevelImg} width="100%"/>
            </Row>
            <Row 
                rendered 
                idx={5}
                title="5. Combustibility / Flammability" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="is_combustible" type="radio" placeholder="Is Combustible?" defaultValue={is_combustible} vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_combustible} returnValue/>
                <ClearableInput name="is_flammable" type="radio" placeholder="Is Flammable?" defaultValue={is_flammable} vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_flammable} returnValue/>
                <ClearableInput name="flammability_combustibility_class" type="radio" placeholder="Flammability / Combustibility Class" defaultValue={flammability_combustibility_class} vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.flammability_class} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={6}
                title="6. Fire Fighting" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="fire_fighting_foam" type="radio" placeholder="Foam" defaultValue={fire_fighting_foam} vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_foam} returnValue/>
                <ClearableInput name="fire_fighting_dcp" type="radio" placeholder="DCP" defaultValue={fire_fighting_dcp} vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_dcp} returnValue/>
                <ClearableInput name="fire_fighting_co2" type="radio" placeholder="CO2" defaultValue={fire_fighting_co2} vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_co2} returnValue/>
                <ClearableInput name="fire_fighting_sand" type="radio" placeholder="Sand" defaultValue={fire_fighting_sand} vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_sand} returnValue/>
                <ClearableInput name="fire_fighting_water" type="select_multi" placeholder="Water..." defaultValue={fire_fighting_water} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_water} add returnValue/>
                <ClearableInput name="fire_fighting_other" type="select_multi" placeholder="Other..." defaultValue={fire_fighting_other} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_other} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={7}
                title="7. Hazard Class" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="is_hazardous" type="radio" placeholder="Is Substance Hazardous?" defaultValue={is_hazardous} vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.is_hazardous} returnValue/>
                <Fragment ref="hazardous_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-10 margin-r-5"/>
                    
                    <ClearableInput name="hazard_class_list" type="checkbox" placeholder="Hazard Class" defaultValue={hazard_class_list} vertical={4} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.hazard_class_list} returnValue/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                active={!!getSDSAttached}
                idx={8}
                title="8. Safety Data Sheet (SDS)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_sds" type="radio" placeholder="Has SDS?" defaultValue={has_sds} vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_sds} returnValue/>
                <Fragment ref="sds_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                    
                    <SelectSDSProductInput name="sds" type="select" placeholder="Safety Data Sheet (SDS)..." defaultValue={sds} className="col-lg-5 form-control margin-b-10" onChange={this.form.onChange}/>
                    
                    <h2 className="col-lg-2 margin-h-5 margin-v-10 text-center">OR</h2>
                    
                    <UploadButton 
                        name="sds_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        defaultValue={sds_doc}
                        className="col-lg-5"
                        onChange={this.form.onChange}
                    />
                    
                    <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                    
                    <ClearableInput name="sds_date" type="date" placeholder="Safety Data Sheet Date" defaultValue={sds_date} className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                active={!!getHazchemSheetAttached}
                idx={9}
                title="9. Hazchem Sheet" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_hazchem_sheet" type="radio" placeholder="Has Hazchem Sheet?" defaultValue={has_hazchem_sheet} vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_hazchem_sheet} returnValue/>
                <Fragment ref="hazchem_sheet_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                    
                    <SelectHazchemSheetInput name="hazchem_sheet" type="select" placeholder="Hazchem Sheet..." defaultValue={hazchem_sheet} className="col-lg-5 form-control margin-b-10" onChange={this.form.onChange}/>
            
                    <h2 className="col-lg-2 margin-h-5 margin-v-10 text-center">OR</h2>
                    
                    <UploadButton 
                        name="hazchem_sheet_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        defaultValue={hazchem_sheet_doc}
                        className="col-lg-5"
                        onChange={this.form.onChange}
                    />
                    
                    <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                    
                    <ClearableInput name="hazchem_sheet_date" type="date" placeholder="Hazchem Sheet Date" defaultValue={hazchem_sheet_date} className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                active={!!getRAAttached}
                idx={10}
                title="10. Risk Assessment" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_risk_assessment" type="radio" placeholder="Has Risk Assessment?" defaultValue={has_risk_assessment} vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_risk_assessment} returnValue/>
                <Fragment ref="risk_assessment_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                    
                    <UploadButton 
                        name="risk_assessment_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        defaultValue={risk_assessment_doc}
                        className="col-lg-6 hor-center"
                        onChange={this.form.onChange}
                    />
                    
                    <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                    
                    <ClearableInput name="risk_assessment_date" type="date" placeholder="Risk Assessment Date" defaultValue={risk_assessment_date} className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                idx={11}
                title="11. PPE Required" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <NewPPEItemListTable name="ppe_list" defaultValue={[...(ppe_list || []), null]} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={12}
                title="12. Action / Comments" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="action_or_comments" name="action_or_comments" defaultValue={action_or_comments} height={300} open={true} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={13}
                title="13. Stock Control" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <NewChemicalStockItemListTable name="chemical_stock_list" defaultValue={[...(chemical_stock_list || []), null]} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditInventoryProductDialog;
