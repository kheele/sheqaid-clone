// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {TinyMCE} from 'components/documents';
import {ShouldUpdate} from "utils/Utils";
import {AEditDialog} from 'components/dialogs';
import {
    ClearableInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {changeColors} from './Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./EditInventoryContainerDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditInventoryContainerDialog extends AEditDialog {
    pageKey = "EditInventoryContainerDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Chemical Container";
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
            emergency_phone_nums: [], 
            risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}, {text: 'Very High', value: 'Very High'}],
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onFormChange = this.onFormChange.bind(this);
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("risk_level", this.onChangeRiskLevel.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeRiskLevel">
    onChangeRiskLevel(el, risk_level) {
        const {props: {dialog, execWhen}} = this;
	execWhen(() => !!dialog && dialog.getDOMNode()).then(() => {
            changeColors(dialog, risk_level);
	});
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const refs = `
            more_product_info
            composition_or_information_on_ingredients
            hazards_identification
            first_aid_measures_and_precautions
            firefighting_measures
            accidental_release_measures
            handling_and_storage_requirements
            exposure_controls_or_personal_protection
            physical_and_chemical_properties
            stability_and_reactivity
            toxicological_info
            ecological_info
            disposal_considerations
            transport_info
            regulatory_info
            other_info
        `.split('\n').map(v => v.trim()).filter(v => !v.isEmpty());
        
        const toggle = (n) => {
            n -= 1;
            setTimeout(() => {
                const _refs = refs.map(refName => this.refs[refName]);
                _refs.filter(ref => ref.isOpen).forEach(ref => ref.hide());
                const currRef = _refs.find((ref, idx) => idx === n);
                currRef && currRef.show();
            });
        };
        
        toggle(idx - 1);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Product Name is required');
                return;
            }
//            if (!form.isValid('category')) {
//                infoDialog.open('Category is required');
//                return;
//            }
        }
//        if(idx === 2) {
//            if (!form.isValid('risk_level')) {
//                infoDialog.open('Risk Assessment Level is required');
//                return;
//            }
//        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        
        //0
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //1
        if (!form.isValid('name')) {
            infoDialog.open('Product Name is required');
            return;
        }
//        if (!form.isValid('category')) {
//            infoDialog.open('Category is required');
//            return;
//        }
        //2
//        if (!form.isValid('risk_level')) {
//            infoDialog.open('Risk Assessment Level is required');
//            return;
//        }
        //3
//        if (!form.isValid('doc')) {
//            infoDialog.open('Please Upload the Document');
//            return;
//        }
        
        const { 
            client, project, site,
            //
            name, common_names, chemical_name, empirical_formula, un_num, 
            category, date_identified,//other added
            application_or_use,
            manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
            emergency_phone_nums, 
//            emergency_phone, //replaced with emergency_phone_nums
            risk_level,//other added
            more_product_info,
            //
            composition_or_information_on_ingredients,
            hazards_identification,
            first_aid_measures_and_precautions,
            firefighting_measures,
            accidental_release_measures,
            handling_and_storage_requirements,
            exposure_controls_or_personal_protection,
            physical_and_chemical_properties,
            stability_and_reactivity,
            toxicological_info,
            ecological_info,
            disposal_considerations,
            transport_info,
            regulatory_info,
            other_info, 
            //
            doc
        } = form.data;
        const data = {};
        
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, common_names, 'common_names');
        ShouldUpdate.check(data, old_data, chemical_name, 'chemical_name');
        ShouldUpdate.check(data, old_data, empirical_formula, 'empirical_formula');
        ShouldUpdate.check(data, old_data, un_num, 'un_num');
        ShouldUpdate.check(data, old_data, category, 'category');//other added
        ShouldUpdate.checkDate(data, old_data, date_identified, 'date_identified');//other added
        ShouldUpdate.check(data, old_data, application_or_use, 'application_or_use');
        ShouldUpdate.check(data, old_data, manufacturer, 'manufacturer');
        ShouldUpdate.check(data, old_data, manufacturer_addr, 'manufacturer_addr');
        ShouldUpdate.check(data, old_data, manufacturer_phone_num, 'manufacturer_phone_num');
        ShouldUpdate.check(data, old_data, manufacturer_email, 'manufacturer_email');
        ShouldUpdate.check(data, old_data, manufacturer_fax, 'manufacturer_fax');
        ShouldUpdate.check(data, old_data, manufacturer_website, 'manufacturer_website');
        ShouldUpdate.check(data, old_data, emergency_phone_nums, 'emergency_phone_nums');
//        ShouldUpdate.check(data, old_data, emergency_phone, 'emergency_phone'); //replaced with emergency_phone_nums
        ShouldUpdate.check(data, old_data, risk_level, 'risk_level');//other added
        ShouldUpdate.check(data, old_data, more_product_info, 'more_product_info');
        
        ShouldUpdate.check(data, old_data, composition_or_information_on_ingredients, 'composition_or_information_on_ingredients');
        ShouldUpdate.check(data, old_data, hazards_identification, 'hazards_identification');
        ShouldUpdate.check(data, old_data, first_aid_measures_and_precautions, 'first_aid_measures_and_precautions');
        ShouldUpdate.check(data, old_data, firefighting_measures, 'firefighting_measures');
        ShouldUpdate.check(data, old_data, accidental_release_measures, 'accidental_release_measures');
        ShouldUpdate.check(data, old_data, handling_and_storage_requirements, 'handling_and_storage_requirements');
        ShouldUpdate.check(data, old_data, exposure_controls_or_personal_protection, 'exposure_controls_or_personal_protection');
        ShouldUpdate.check(data, old_data, physical_and_chemical_properties, 'physical_and_chemical_properties');
        ShouldUpdate.check(data, old_data, stability_and_reactivity, 'stability_and_reactivity');
        ShouldUpdate.check(data, old_data, toxicological_info, 'toxicological_info');
        ShouldUpdate.check(data, old_data, ecological_info, 'ecological_info');
        ShouldUpdate.check(data, old_data, disposal_considerations, 'disposal_considerations');
        ShouldUpdate.check(data, old_data, transport_info, 'transport_info');
        ShouldUpdate.check(data, old_data, regulatory_info, 'regulatory_info');
        ShouldUpdate.check(data, old_data, other_info,  'other_info');
                
//        ShouldUpdate.checkFile(data, old_data, doc, 'doc');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
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
                    //
                    client, project, site,
                    //
                    name, common_names, chemical_name, empirical_formula, un_num, 
                    category, date_identified,//other added
                    application_or_use,
                    manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                    emergency_phone_nums, 
        //            emergency_phone, //replaced with emergency_phone_nums
                    risk_level,//other added
                    more_product_info,
                    //
                    composition_or_information_on_ingredients,
                    hazards_identification,
                    first_aid_measures_and_precautions,
                    firefighting_measures,
                    accidental_release_measures,
                    handling_and_storage_requirements,
                    exposure_controls_or_personal_protection,
                    physical_and_chemical_properties,
                    stability_and_reactivity,
                    toxicological_info,
                    ecological_info,
                    disposal_considerations,
                    transport_info,
                    regulatory_info,
                    other_info, 
                    //
                    doc
                }
            }
        } = this;
        
        const manufacturerDefault = manufacturer ? {label: manufacturer, value: manufacturer} : null;
        
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row 
                rendered 
                active={isNoProjects}
                idx={1}
                title="1. Product & Company Identification" 
                onFormOpen={onFormOpen} 
                onFormBack={!isNoProjects && onFormBack} 
                onFormNext={onFormNext}
            >    
                <label className="col-lg-12 padding-0 pull-left">Product Identification</label>
                <ClearableInput name="name" type="text" placeholder="Product Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="common_names" type="text" placeholder="Common Names / Synonyms" defaultValue={common_names} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="chemical_name" type="text" placeholder="Chemical Name" defaultValue={chemical_name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="empirical_formula" type="text" placeholder="Empirical Formula" defaultValue={empirical_formula} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="un_num" type="text" placeholder="UN Number" defaultValue={un_num} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                
                <hr className="col-lg-12 margin-0"/>
                <SelectChemicalCategoryInput name="category" placeholder="Category..." defaultValue={category} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="date_identified" type="date" placeholder="Date Identified..." defaultValue={date_identified} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                <ClearableInput name="application_or_use" type="textarea" placeholder="Application / Use" defaultValue={application_or_use} required className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                <SelectChemicalManufacturerInput name="manufacturer" placeholder="Manufacturer..." defaultValue={manufacturer} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_addr" type="textarea" placeholder="Address" defaultValue={manufacturer_addr} required className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_phone_num" type="text" placeholder="Telephone" defaultValue={manufacturer_phone_num} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_email" type="text" placeholder="E-mail Address" defaultValue={manufacturer_email} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_fax" type="text" placeholder="Fax" defaultValue={manufacturer_fax} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="manufacturer_website" type="text" placeholder="Website" defaultValue={manufacturer_website} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                <ClearableInput name="emergency_phone_nums" type="select_multi" placeholder="Emergency Phone Numbers..." defaultValue={emergency_phone_nums} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.emergency_phone_nums} add returnValue/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Risk Level</label>
                <ClearableInput name="risk_level" type="radio" placeholder="Risk Level" defaultValue={risk_level} required className="col-lg-9 pull-left-1_5 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level}/>
                <p className="hor-center text-center padding-t-10 margin-t-20 w-full"><b>Please refer to the diagram below</b></p>
                <img src={riskLevelImg} width="100%"/>
                
                <label className="col-lg-12 margin-t-5 margin-b-5 padding-0 pull-left">More Product Information</label>
                <TinyMCE ref="more_product_info" name="more_product_info" height={300} open={false} defaultValue={more_product_info} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Composition/Information On Ingredients" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="composition_or_information_on_ingredients" name="composition_or_information_on_ingredients" height={300} open={false} defaultValue={composition_or_information_on_ingredients} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Hazards Identification" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="hazards_identification" name="hazards_identification" height={300} open={false} defaultValue={hazards_identification} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. First Aid Measures & Precautions" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="first_aid_measures_and_precautions" name="first_aid_measures_and_precautions" height={300} open={false} defaultValue={first_aid_measures_and_precautions} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={5}
                title="5. Firefighting Measures" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="firefighting_measures" name="firefighting_measures" height={300} open={false} defaultValue={firefighting_measures} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={6}
                title="6. Accidental Release Measures (Spillage)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="accidental_release_measures" name="accidental_release_measures" height={300} open={false} defaultValue={accidental_release_measures} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={7}
                title="7. Handling & Storage Requirements" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="handling_and_storage_requirements" name="handling_and_storage_requirements" height={300} open={false} defaultValue={handling_and_storage_requirements} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={8}
                title="8. Exposure Controls / Personal Protection" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="exposure_controls_or_personal_protection" name="exposure_controls_or_personal_protection" height={300} open={false} defaultValue={exposure_controls_or_personal_protection} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={9}
                title="9. Physical & Chemical Properties" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="physical_and_chemical_properties" name="physical_and_chemical_properties" height={300} open={false} defaultValue={physical_and_chemical_properties} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={10}
                title="10. Stability & Reactivity" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="stability_and_reactivity" name="stability_and_reactivity" height={300} open={false} defaultValue={stability_and_reactivity} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={11}
                title="11. Toxicological Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="toxicological_info" name="toxicological_info" height={300} open={false} defaultValue={toxicological_info} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={12}
                title="12. Ecological Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="ecological_info" name="ecological_info" height={300} open={false} defaultValue={ecological_info} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={13}
                title="13. Disposal Considerations" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="disposal_considerations" name="disposal_considerations" height={300} open={false} defaultValue={disposal_considerations} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={14}
                title="14. Transport Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="transport_info" name="transport_info" height={300} open={false} defaultValue={transport_info} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={15}
                title="15. Regulatory Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <label className="padding-0">
                    Safety, health and environmental regulations/legislation specific for the substance or mixture
                </label>
                <TinyMCE ref="regulatory_info" name="regulatory_info" height={300} open={false} defaultValue={regulatory_info} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={16}
                title="16. Other Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <TinyMCE ref="other_info" name="other_info" height={300} open={false} defaultValue={other_info} onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditInventoryContainerDialog;
