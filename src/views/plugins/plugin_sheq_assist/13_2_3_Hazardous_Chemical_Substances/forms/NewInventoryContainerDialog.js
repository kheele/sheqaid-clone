// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {execWhen} from "utils/Utils";
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
import {ANewDialog} from 'components/dialogs';

import {changeColors} from './Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./NewInventoryContainerDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewInventoryContainerDialog extends ANewDialog {
    pageKey = "NewInventoryContainerDialog";
    title = "Create Chemical Container";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/container-inventory/";

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
        const {form} = this;
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
            manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
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
        const data = {
            //0
            client: {id: client.id, name: client.data.name},
            //1
            name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
            category, physical_state, type,
            application_or_use,
            manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
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
        };
        
        //0 
        if(project) {
            const {id, data: _data, name} = project;
            data.project = {id, name: name || _data.name};
        }
        if(site) {
            const {id, data: _data, name} = site;
            data.site = {id, name: name || _data.name};
        } 
        //1
        emergency_phone_nums && (data.emergency_phone_nums = emergency_phone_nums.slice());
        //2
        location_where_product_is_used && (data.location_where_product_is_used = location_where_product_is_used.slice());
        heat_sparks_static_flames && (data.heat_sparks_static_flames = heat_sparks_static_flames.slice());
        spillage_control && (data.spillage_control = spillage_control.slice());
        other_special_info && (data.other_special_info = other_special_info.slice());
        //3
        compatible_with_list && (data.compatible_with_list = compatible_with_list.slice());
        incompatible_with_list && (data.incompatible_with_list = incompatible_with_list.slice());
        //6
        fire_fighting_water && (data.fire_fighting_water = fire_fighting_water.slice());
        fire_fighting_other && (data.fire_fighting_other = fire_fighting_other.slice());
        //7
        hazard_class_list && (data.hazard_class_list = hazard_class_list.slice());
        //11
        if(ppe_list) {
            data.ppe_list = ppe_list.map(v => {
                if(v.ppe) {
                    return v.ppe.id;
                } else {
                    return v.id;
                }
            });
        }
        //13
        chemical_stock_list && (data.chemical_stock_list = chemical_stock_list.slice());
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
    
    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() { 
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, isNoProjects} = storage.is;
        
        return <FormControls>
            {!isNoProjects && <Row 
                rendered  
                active
                idx={0}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row 
                rendered 
                active={isNoProjects}
                idx={1}
                title="1. Product Details" 
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen} 
                onFormBack={!isNoProjects && onFormBack} 
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 padding-0 pull-left">Product Identification</label>
                <ClearableInput name="name" type="text" placeholder="Product Name" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="common_names" type="text" placeholder="Common Names / Synonyms" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="chemical_name" type="text" placeholder="Chemical Name" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="empirical_formula" type="text" placeholder="Empirical Formula" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="un_num" type="text" placeholder="UN Number" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="cas_num" type="text" placeholder="CAS Number" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="concentration" type="text" placeholder="Concentration" className="col-lg-4 form-control" onChange={this.form.onChange}/>
                
                <hr className="col-lg-12 margin-t-5 margin-b-10"/>
                
                <SelectChemicalCategoryInput name="category" placeholder="Category..." className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <SelectChemicalPhysicalStateInput name="physical_state" placeholder="Physical State..." className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <SelectChemicalTypesInput name="type" placeholder="Type..." className="col-lg-4 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                <ClearableInput name="application_or_use" type="textarea" placeholder="Application / Use" className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                <SelectChemicalManufacturerInput name="manufacturer" placeholder="Manufacturer..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_addr" type="textarea" placeholder="Address" className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_phone_num" type="text" placeholder="Telephone" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_fax" type="text" placeholder="Fax" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_email" type="text" placeholder="E-mail Address" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_website" type="text" placeholder="Website" className="col-lg-6 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                <ClearableInput name="emergency_phone_nums" type="select_multi" placeholder="Emergency Phone Numbers..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.emergency_phone_nums} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Further Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="location_where_product_is_used" type="select_multi" placeholder="Location Where Product Is Used..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.location_where_product_is_used} add returnValue/>
                <ClearableInput name="process_where_product_is_used" type="textarea" placeholder="Process Where Product Is Used" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                
                <hr className="col-lg-12 margin-t-5 margin-b-10"/>
            
                <ClearableInput name="is_stable" type="radio" placeholder="Is Stable?" vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_stable} returnValue/>
                <ClearableInput name="is_cool_well_ventilated_area" type="radio" placeholder="Requires Cool, Well-Ventilated Area?" vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_cool_well_ventilated_area} returnValue/>
                <ClearableInput name="heat_sparks_static_flames" type="select_multi" placeholder="Heat, Sparks, Static, Flames..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.heat_sparks_static_flames} add returnValue/>
                <ClearableInput name="spillage_control" type="select_multi" placeholder="Spillage Control..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.spillage_control} add returnValue/>
                <ClearableInput name="other_special_info" type="select_multi" placeholder="Other Special Info..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.other_special_info} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Product Compatibility" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="compatible_with_list" type="select_multi" placeholder="Compatible With..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.compatible_with_list} add returnValue/>
                <ClearableInput name="incompatible_with_list" type="select_multi" placeholder="Incompatible With..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.incompatible_with_list} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. Risk Level / Class" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="risk_level" type="radio" placeholder="Risk Level" className="col-lg-9 pull-left-1_5 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level}/>
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
                <ClearableInput name="is_combustible" type="radio" placeholder="Is Combustible?" vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_combustible} returnValue/>
                <ClearableInput name="is_flammable" type="radio" placeholder="Is Flammable?" vertical className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.is_flammable} returnValue/>
                <ClearableInput name="flammability_combustibility_class" type="radio" placeholder="Flammability / Combustibility Class" vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.flammability_class} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={6}
                title="6. Fire Fighting" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="fire_fighting_foam" type="radio" placeholder="Foam" vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_foam} returnValue/>
                <ClearableInput name="fire_fighting_dcp" type="radio" placeholder="DCP" vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_dcp} returnValue/>
                <ClearableInput name="fire_fighting_co2" type="radio" placeholder="CO2" vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_co2} returnValue/>
                <ClearableInput name="fire_fighting_sand" type="radio" placeholder="Sand" vertical className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_sand} returnValue/>
                <ClearableInput name="fire_fighting_water" type="select_multi" placeholder="Water..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_water} add returnValue/>
                <ClearableInput name="fire_fighting_other" type="select_multi" placeholder="Other..." className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.fire_fighting_other} add returnValue/>
            </Row>
            <Row 
                rendered 
                idx={7}
                title="7. Hazard Class" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="is_hazardous" type="radio" placeholder="Is Substance Hazard?" vertical={4} className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.is_hazardous} returnValue/>
                <Fragment ref="hazardous_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-10"/>
                    
                    <ClearableInput name="hazard_class_list" type="checkbox" placeholder="Hazard Class" vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.hazard_class_list} returnValue/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                idx={8}
                title="8. Safety Data Sheet (SDS)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_sds" type="radio" placeholder="Has SDS?" vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_sds} returnValue/>
                <Fragment ref="sds_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-20"/>
                    
                    <SelectSDSProductInput name="sds" type="select" placeholder="Safety Data Sheet (SDS)..." className="col-lg-6 hor-center form-control margin-b-10" onChange={this.form.onChange}/>
                    
                    <hr className="col-lg-12 margin-t-0 margin-b-10"/>
                    <h2 className="hor-center margin-0">OR</h2>
                    <hr className="col-lg-12 margin-t-0 margin-b-20"/>
                    
                    <UploadButton 
                        name="sds_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        className="col-lg-6 hor-center"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput name="sds_date" type="date" placeholder="Safety Data Sheet Date" className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                idx={9}
                title="9. Hazchem Sheet" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_hazchem_sheet" type="radio" placeholder="Has Hazchem Sheet?" vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_hazchem_sheet} returnValue/>
                <Fragment ref="hazchem_sheet_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-20"/>
                    
                    <SelectHazchemSheetInput name="hazchem_sheet" type="select" placeholder="Hazchem Sheet..." className="col-lg-6 hor-center form-control margin-b-10" onChange={this.form.onChange}/>
            
                    <hr className="col-lg-12 margin-t-0 margin-b-10"/>
                    <h2 className="hor-center margin-0">OR</h2>
                    <hr className="col-lg-12 margin-t-0 margin-b-20"/>
                    
                    <UploadButton 
                        name="hazchem_sheet_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        className="col-lg-6 hor-center"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput name="hazchem_sheet_date" type="date" placeholder="Hazchem Sheet Date" className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                idx={10}
                title="10. Risk Assessment" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_risk_assessment" type="radio" placeholder="Has Risk Assessment?" vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_risk_assessment} returnValue/>
                <Fragment ref="risk_assessment_details_sec" rendered={false}>
                    <hr className="col-lg-12 margin-t-5 margin-b-20"/>
                    
                    <UploadButton 
                        name="risk_assessment_doc"
                        buttonTitle="Risk Assessment Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        className="col-lg-6 hor-center"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput name="risk_assessment_date" type="date" placeholder="Risk Assessment Date" className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
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
                <NewPPEItemListTable name="ppe_list" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={12}
                title="12. Action / Comments" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="action_or_comments" name="action_or_comments" height={300} open={true} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={13}
                title="13. Stock Control" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <NewChemicalStockItemListTable name="chemical_stock_list" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewInventoryContainerDialog;
