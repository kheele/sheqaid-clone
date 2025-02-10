// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {TinyMCE} from 'components/documents';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import ProfilePDFReader from '../printers/ProfileMSDSPDFReader';

import {changeColors} from '../dialogs/Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./ProfileMSDSDialog.lazy.css";
import NewChemicalSupplierListTable from "components/FormTableComponents/NewChemicalSupplierListTable";
import updateChemicalSDS from "mutations/all/Chemicals/ChemicalSDS/updateChemicalSDS";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileMSDSDialog";
    removeById = updateChemicalSDS;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Safety Data Sheet";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
    
    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onFormChange = this.onFormChange.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {props: {dialog, execWhen}} = this;
	execWhen(() => this.item).then(({data: {risk_level}}) => {
            execWhen(() => !!dialog && dialog.getDOMNode()).then(() => {
                changeColors(dialog, risk_level);
            });
	});
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
                _refs.filter(ref => ref.isOpen).forEach(ref => ref.hide());
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
    
    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
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
                    supplier_list,
                    emergency_phone_nums = [], 
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
        
        const {isConsultant} = storage.is;
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={0}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField name="client" title="Company" value={client} renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>}
                <ProfileField name="project" title="Project" value={project} renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>
                <ProfileField name="site" title="Site" value={site} renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={1}
                title="1. Product & Company Identification"
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 padding-0 pull-left">Product Identification</label>
                <ProfileField name="name" placeholder="Product Name" value={name} required className="col-lg-12"/>
                <ProfileField name="common_names" placeholder="Common Names / Synonyms" value={common_names} required className="col-lg-12"/>
                <ProfileField name="chemical_name" placeholder="Chemical Name" value={chemical_name} required className="col-lg-12"/>
                <ProfileField name="empirical_formula" placeholder="Empirical Formula" value={empirical_formula} required className="col-lg-12"/>
                <ProfileField name="un_num" placeholder="UN Number" value={un_num} required className="col-lg-12"/>
                
                <hr className="col-lg-12 margin-0"/>
                <ProfileField name="category" placeholder="Category" value={category} required className="col-lg-12"/>
                <ProfileField name="date_identified" type="date" placeholder="Date Identified" value={date_identified} required className="col-lg-12"/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                <ProfileField name="application_or_use" placeholder="Application / Use" value={application_or_use} required className="col-lg-12 min-h-60"/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                <NewChemicalSupplierListTable ref="supplier_list" name="supplier_list" defaultValue={supplier_list} className="col-lg-12 form-control" readonly/>

                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                <ProfileField name="emergency_phone_nums" type="select_multi" placeholder="Emergency Phone Numbers..." value={emergency_phone_nums} renderer={v => v.join(', ')} required className="col-lg-12"/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Risk Level</label>
                <ProfileField name="risk_level" placeholder="Risk Level" value={risk_level} required className="col-lg-12"/>
                <p className="hor-center text-center padding-t-10 margin-t-20 w-full"><b>Please refer to the diagram below</b></p>
                <img src={riskLevelImg} width="100%" className="RiskLevelImg"/>
                
                <label className="col-lg-12 margin-t-5 margin-b-5 padding-0 pull-left">More Product Information</label>
                <TinyMCE ref="more_product_info" name="more_product_info" height={300} open={false} defaultValue={more_product_info} readonly/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Composition/Information On Ingredients" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="composition_or_information_on_ingredients" name="composition_or_information_on_ingredients" height={300} open={false} readonly defaultValue={composition_or_information_on_ingredients} readonly/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Hazards Identification" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="hazards_identification" name="hazards_identification" height={300} open={false} readonly defaultValue={hazards_identification} readonly/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. First Aid Measures & Precautions" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="first_aid_measures_and_precautions" name="first_aid_measures_and_precautions" height={300} open={false} readonly defaultValue={first_aid_measures_and_precautions} readonly/>
            </Row>
            <Row 
                rendered 
                idx={5}
                title="5. Firefighting Measures" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="firefighting_measures" name="firefighting_measures" height={300} open={false} readonly defaultValue={firefighting_measures} readonly/>
            </Row>
            <Row 
                rendered 
                idx={6}
                title="6. Accidental Release Measures (Spillage)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="accidental_release_measures" name="accidental_release_measures" height={300} open={false} readonly defaultValue={accidental_release_measures} readonly/>
            </Row>
            <Row 
                rendered 
                idx={7}
                title="7. Handling & Storage Requirements" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="handling_and_storage_requirements" name="handling_and_storage_requirements" height={300} open={false} readonly defaultValue={handling_and_storage_requirements} readonly/>
            </Row>
            <Row 
                rendered 
                idx={8}
                title="8. Exposure Controls / Personal Protection" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="exposure_controls_or_personal_protection" name="exposure_controls_or_personal_protection" height={300} open={false} readonly defaultValue={exposure_controls_or_personal_protection} readonly/>
            </Row>
            <Row 
                rendered 
                idx={9}
                title="9. Physical & Chemical Properties" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="physical_and_chemical_properties" name="physical_and_chemical_properties" height={300} open={false} readonly defaultValue={physical_and_chemical_properties} readonly/>
            </Row>
            <Row 
                rendered 
                idx={10}
                title="10. Stability & Reactivity" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="stability_and_reactivity" name="stability_and_reactivity" height={300} open={false} readonly defaultValue={stability_and_reactivity} readonly/>
            </Row>
            <Row 
                rendered 
                idx={11}
                title="11. Toxicological Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="toxicological_info" name="toxicological_info" height={300} open={false} readonly defaultValue={toxicological_info} readonly/>
            </Row>
            <Row 
                rendered 
                idx={12}
                title="12. Ecological Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="ecological_info" name="ecological_info" height={300} open={false} readonly defaultValue={ecological_info} readonly/>
            </Row>
            <Row 
                rendered 
                idx={13}
                title="13. Disposal Considerations" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="disposal_considerations" name="disposal_considerations" height={300} open={false} readonly defaultValue={disposal_considerations} readonly/>
            </Row>
            <Row 
                rendered 
                idx={14}
                title="14. Transport Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="transport_info" name="transport_info" height={300} open={false} readonly defaultValue={transport_info} readonly/>
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
                <TinyMCE ref="regulatory_info" name="regulatory_info" height={300} open={false} readonly defaultValue={regulatory_info} readonly/>
            </Row>
            <Row 
                rendered 
                idx={16}
                title="16. Other Information" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="other_info" name="other_info" height={300} open={false} readonly defaultValue={other_info} readonly/>
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
                    defaultValue={doc}
                    className="col-lg-6 hor-center"
                    readonly
                />
            </Row>
            <ProfilePDFReader ref="pdfReader"/>
        </FormControls>;
    }
    // </editor-fold>

}

export default ProfileDialog;
