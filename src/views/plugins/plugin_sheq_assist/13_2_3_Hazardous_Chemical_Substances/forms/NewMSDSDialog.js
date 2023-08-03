// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, toDataURI} from 'utils/Utils';

import {TinyMCE} from 'components/documents';
import {ANewDialog} from 'components/dialogs';
import {
    ClearableInput,
    SelectChemicalCategoryInput,
    SelectChemicalManufacturerInput,
    SelectChemicalProductInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Fragment, Row} from 'components/FormComponents';

import {changeColors} from '../dialogs/Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./NewMSDSDialog.lazy.css";
import insertChemicalSDS from "../../../../../mutations/all/Chemicals/ChemicalSDS/insertChemicalSDS";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewMSDSDialog extends ANewDialog {
    pageKey = "NewMSDSDialog";
    title = "Create Safety Data Sheet";

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
    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/msds/";

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
        this.form.addChangeOne("product", this.onChangeProduct.bind(this));
        this.form.addChangeOne("risk_level", this.onChangeRiskLevel.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {props: {dialog, execWhen}} = this;
//	execWhen(() => this.item).then(val => {
//            this.onChangeProduct.call(this, null, val);
//	});
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeProduct">
    onChangeProduct(el, val) {
        this.state.selectedProduct = val;
        execWhen(() => this.refs.product_info_sec).then(res => {
            if(val) {
                res.show();
                
                if(isObject(val)) {
                    const {
                        id, 
                        data: {
                            //1
                            name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
                            category, physical_state, type,
                            application_or_use,
                            manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                            emergency_phone_nums,
                            //4
                            risk_level,
                        }
                    } = val;
                    execWhen(() => this.refs.name).then(ref => {
                        ref.value = name;
                    });
                    execWhen(() => this.refs.common_names).then(ref => {
                        ref.value = common_names;
                    });
                    execWhen(() => this.refs.chemical_name).then(ref => {
                        ref.value = chemical_name;
                    });
                    execWhen(() => this.refs.empirical_formula).then(ref => {
                        ref.value = empirical_formula;
                    });
                    execWhen(() => this.refs.un_num).then(ref => {
                        ref.value = un_num;
                    });
                    execWhen(() => this.refs.category).then(ref => {
                        ref.value = category;
                    });
                    execWhen(() => this.refs.application_or_use).then(ref => {
                        ref.value = application_or_use;
                    });
                    execWhen(() => this.refs.manufacturer).then(ref => {
                        ref.value = manufacturer;
                    });
                    execWhen(() => this.refs.manufacturer_addr).then(ref => {
                        ref.value = manufacturer_addr;
                    });
                    execWhen(() => this.refs.manufacturer_phone_num).then(ref => {
                        ref.value = manufacturer_phone_num;
                    });
                    execWhen(() => this.refs.manufacturer_fax).then(ref => {
                        ref.value = manufacturer_fax;
                    });
                    execWhen(() => this.refs.manufacturer_email).then(ref => {
                        ref.value = manufacturer_email;
                    });
                    execWhen(() => this.refs.manufacturer_website).then(ref => {
                        ref.value = manufacturer_website;
                    });
                    execWhen(() => this.refs.emergency_phone_nums).then(ref => {
                        ref.value = emergency_phone_nums;
                    });
                    execWhen(() => this.refs.risk_level).then(ref => {
                        ref.value = risk_level;
                    });
                } else {
                    execWhen(() => this.refs.name).then(ref => {
                        ref.value = val;
                    });
                }
            } else {
                res.hide();
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
    
    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {isConsultant, isNoProjects} = storage.is;
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
                _refs.filter(ref => !!ref && ref.isOpen).forEach(ref => ref.hide());
                const currRef = _refs.find((ref, idx) => idx === n);
                currRef && currRef.show();
            });
        };
        
        if(isNoProjects) {
            toggle(idx);
        } else {
            toggle(idx - 1);
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            const {isConsultant} = storage.is;
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
    async onSubmit(e, btn, onSaved) {
        const {form} = this;
           
        const {isConsultant, isNoProjects} = storage.is;
        
        //0
        if (isConsultant && !form.isValid('client')) {
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
            //0
            client, project, site,
            //1
            product,
            name, common_names, chemical_name, empirical_formula, un_num, 
            category, date_identified,//other added
            application_or_use,
            manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
            emergency_phone_nums, 
//            emergency_phone, //replaced with emergency_phone_nums
            risk_level,//other added
            more_product_info,
            //2
            composition_or_information_on_ingredients,
            //3
            hazards_identification,
            //4
            first_aid_measures_and_precautions,
            //5
            firefighting_measures,
            //6
            accidental_release_measures,
            //7
            handling_and_storage_requirements,
            //8
            exposure_controls_or_personal_protection,
            //9
            physical_and_chemical_properties,
            //10
            stability_and_reactivity,
            //11
            toxicological_info,
            //12
            ecological_info,
            //13
            disposal_considerations,
            //14
            transport_info,
            //15
            regulatory_info,
            //16
            other_info,
            //17
            doc
        } = form.data;
        const data = {
            //0
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //
            product_id: product && product.id,
            name,
            common_names,
            chemical_name,
            empirical_formula,
            un_num,
            category,
            date_identified: Dates.formatDateSQL(date_identified),//other added
            application_or_use,
            manufacturer,
            manufacturer_addr,
            manufacturer_phone_num,
            manufacturer_email,
            manufacturer_fax,
            manufacturer_website,
            emergency_phone_nums,
//            emergency_phone, //replaced with emergency_phone_nums
            risk_level,//other added
            more_product_info,
            //2
            composition_or_information_on_ingredients,
            //3
            hazards_identification,
            //4
            first_aid_measures_and_precautions,
            //5
            firefighting_measures,
            //6
            accidental_release_measures,
            //7
            handling_and_storage_requirements,
            //8
            exposure_controls_or_personal_protection,
            //9
            physical_and_chemical_properties,
            //10
            stability_and_reactivity,
            //11
            toxicological_info,
            //12
            ecological_info,
            //13
            disposal_considerations,
            //14
            transport_info,
            //15
            regulatory_info,
            //16
            other_info,
            //17
            doc: doc && {path: await toDataURI(doc.path)},
        };
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertChemicalSDS(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            progressDialog.close();
        });
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }
    
    get chemicalSelected() {
        const {item} = this;
        return item ? {label: item.data.name, value: item} : null;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {} = this;
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                <SelectChemicalProductInput name="product" type="select" placeholder="Chemical Product..." defaultValue={this.chemicalSelected} className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}/>
                <Fragment ref="product_info_sec" rendered={false}>
                    <ClearableInput ref="name" name="name" type="text" placeholder="Product Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="common_names" name="common_names" type="text" placeholder="Common Names / Synonyms" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="chemical_name" name="chemical_name" type="text" placeholder="Chemical Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="empirical_formula" name="empirical_formula" type="text" placeholder="Empirical Formula" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="un_num" name="un_num" type="text" placeholder="UN Number" required className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <hr className="col-lg-12 margin-0"/>
                    <SelectChemicalCategoryInput ref="category" name="category" placeholder="Category..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="date_identified" name="date_identified" type="date" placeholder="Date Identified..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                    <ClearableInput ref="application_or_use" name="application_or_use" type="textarea" placeholder="Application / Use" required className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                    <SelectChemicalManufacturerInput ref="manufacturer" name="manufacturer" placeholder="Manufacturer..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="manufacturer_addr" name="manufacturer_addr" type="textarea" placeholder="Address" required className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="manufacturer_phone_num" name="manufacturer_phone_num" type="text" placeholder="Telephone" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="manufacturer_fax" name="manufacturer_fax" type="text" placeholder="Fax" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="manufacturer_email" name="manufacturer_email" type="text" placeholder="E-mail Address" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="manufacturer_website" name="manufacturer_website" type="text" placeholder="Website" required className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                    <ClearableInput ref="emergency_phone_nums" name="emergency_phone_nums" type="select_multi" placeholder="Emergency Phone Numbers..." required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.emergency_phone_nums} add returnValue/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Risk Level</label>
                    <ClearableInput ref="risk_level" name="risk_level" type="radio" placeholder="Risk Level" required className="col-lg-9 pull-left-1_5 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level}/>
                    <p className="hor-center text-center padding-t-10 margin-t-20 w-full"><b>Please refer to the diagram below</b></p>
                    <img src={riskLevelImg} width="100%"/>

                    <label className="col-lg-12 margin-t-5 margin-b-5 padding-0 pull-left">More Product Information</label>
                    <TinyMCE ref="more_product_info" name="more_product_info" height={300} open={false} onChange={this.form.onChange}/>
                </Fragment>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Composition/Information On Ingredients" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="composition_or_information_on_ingredients" name="composition_or_information_on_ingredients" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Hazards Identification" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="hazards_identification" name="hazards_identification" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. First Aid Measures & Precautions" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="first_aid_measures_and_precautions" name="first_aid_measures_and_precautions" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={5}
                title="5. Firefighting Measures" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="firefighting_measures" name="firefighting_measures" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={6}
                title="6. Accidental Release Measures (Spillage)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="accidental_release_measures" name="accidental_release_measures" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={7}
                title="7. Handling & Storage Requirements" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="handling_and_storage_requirements" name="handling_and_storage_requirements" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={8}
                title="8. Exposure Controls / Personal Protection" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="exposure_controls_or_personal_protection" name="exposure_controls_or_personal_protection" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={9}
                title="9. Physical & Chemical Properties" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="physical_and_chemical_properties" name="physical_and_chemical_properties" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={10}
                title="10. Stability & Reactivity" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="stability_and_reactivity" name="stability_and_reactivity" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={11}
                title="11. Toxicological Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="toxicological_info" name="toxicological_info" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={12}
                title="12. Ecological Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="ecological_info" name="ecological_info" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={13}
                title="13. Disposal Considerations" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="disposal_considerations" name="disposal_considerations" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={14}
                title="14. Transport Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="transport_info" name="transport_info" height={300} open={false} onChange={this.form.onChange}/>
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
                <TinyMCE ref="regulatory_info" name="regulatory_info" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={16}
                title="16. Other Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="other_info" name="other_info" height={300} open={false} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={17}
                title="17. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Document (PDF, Word)"
                    type={['Word', 'PDF']}
                    showOnlyIcon
                    className="col-lg-6 hor-center"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewMSDSDialog;
