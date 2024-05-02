// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {TinyMCE} from 'components/documents';
import {ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Fragment, Row} from 'components/FormComponents';
import {NewChemicalStockItemListTable, NewPPEItemListTable} from 'components/FormTableComponents';
import {AProfileDialog} from 'components/dialogs';

import ProfilePDFReader from '../printers/ProfileInventoryProductPDFReader';

import {changeColors} from '../dialogs/Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./ProfileInventoryProductDialog.lazy.css";
import NewChemicalSupplierListTable from "../../../../../components/FormTableComponents/NewChemicalSupplierListTable";
import updateChemicalProduct from "mutations/all/Chemicals/ChemicalProduct/updateChemicalProduct";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileInventoryProductDialog";
    removeById = updateChemicalProduct ;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Chemical Product";
    }

//    onSaveAsPDF(e, btn) {
//        this.refs.controls.onSaveAsPDF(e, btn);
//    }
    
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
                    ppe_type_list,
                    //12
                    action_or_comments,
                    //13
                    chemical_stock_list
                }
            }
        } = this;
        
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
                {isConsultant && <ProfileField name="client" title="Company" value={client} renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>}
                <ProfileField name="project" title="Project" value={project} renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>
                <ProfileField name="site" title="Site" value={site} renderer={val => isString(val) ? val : (val.name || val.data.name)} className="col-lg-12"/>
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
                <ProfileField name="name" title="Product Name" value={name} className="col-lg-12"/>
                <ProfileField name="common_names" title="Common Names / Synonyms" value={common_names} className="col-lg-12"/>
                <ProfileField name="chemical_name" title="Chemical Name" value={chemical_name} className="col-lg-12"/>
                <ProfileField name="empirical_formula" title="Empirical Formula" value={empirical_formula} className="col-lg-12"/>
                <ProfileField name="un_num" title="UN Number" value={un_num} className="col-lg-4"/>
                <ProfileField name="cas_num" title="CAS Number" value={cas_num} className="col-lg-4"/>
                <ProfileField name="concentration" title="Concentration" value={concentration} className="col-lg-4"/>
                
                <hr className="col-lg-12 margin-v-5 margin-r-5"/>
                
                <ProfileField name="category" title="Category" value={category} className="col-lg-12"/>
                <ProfileField name="physical_state" title="Physical State" value={physical_state} className="col-lg-6"/>
                <ProfileField name="type" title="Type" value={type} className="col-lg-6"/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                <ProfileField name="application_or_use" title="Application / Use" value={application_or_use} className="col-lg-12"/>
                
                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                <NewChemicalSupplierListTable ref="supplier_list" name="supplier_list" defaultValue={supplier_list} className="col-lg-12 form-control" readonly/>

                <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                <ProfileField name="emergency_phone_nums" title="Emergency Phone Numbers" value={emergency_phone_nums} renderer={v => v.join(', ')} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Further Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField name="location_where_product_is_used" title="Location Where Product Is Used" value={location_where_product_is_used} renderer={v => v.join(', ')} className="col-lg-12"/>
                <ProfileField name="process_where_product_is_used" title="Process Where Product Is Used" value={process_where_product_is_used} className="col-lg-12"/>
                
                <hr className="col-lg-12 margin-v-5 margin-r-5"/>
            
                <ProfileField name="is_stable" title="Is It Stable?" value={is_stable} className="col-lg-6"/>
                <ProfileField name="is_cool_well_ventilated_area" title="Does It Require Cool, Well-Ventilated Area?" value={is_cool_well_ventilated_area} className="col-lg-6"/>
                <ProfileField name="heat_sparks_static_flames" title="Heat, Sparks, Static, Flames" value={heat_sparks_static_flames} renderer={v => v.join(', ')} className="col-lg-12"/>
                <ProfileField name="spillage_control" title="Spillage Control" value={spillage_control} renderer={v => v.join(', ')} className="col-lg-12"/>
                <ProfileField name="other_special_info" title="Other Special Info" value={other_special_info} renderer={v => v.join(', ')} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Product Compatibility" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField name="compatible_with_list" title="Compatible With" value={compatible_with_list} renderer={v => v.join(', ')} className="col-lg-12"/>
                <ProfileField name="incompatible_with_list" title="Incompatible With" value={incompatible_with_list} renderer={v => v.join(', ')} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. Risk Level / Class" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField name="risk_level" title="Risk Level" value={risk_level} className="col-lg-12"/>
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
                <ProfileField name="is_combustible" title="Is It Combustible?" value={is_combustible} className="col-lg-12"/>
                <ProfileField name="is_flammable" title="Is It Flammable?" value={is_flammable} className="col-lg-12"/>
                <ProfileField name="flammability_combustibility_class" title="Flammability / Combustibility Class" value={flammability_combustibility_class} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={6}
                title="6. Fire Fighting" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField name="fire_fighting_foam" title="Foam" value={fire_fighting_foam} className="col-lg-6"/>
                <ProfileField name="fire_fighting_dcp" title="DCP" value={fire_fighting_dcp} className="col-lg-6"/>
                <ProfileField name="fire_fighting_co2" title="CO2" value={fire_fighting_co2} className="col-lg-6"/>
                <ProfileField name="fire_fighting_sand" title="Sand" value={fire_fighting_sand} className="col-lg-6"/>
                <ProfileField name="fire_fighting_water" title="Water" value={fire_fighting_water} renderer={v => v.join(', ')} className="col-lg-12"/>
                <ProfileField name="fire_fighting_other" title="Other" value={fire_fighting_other} renderer={v => v.join(', ')} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={7}
                title="7. Hazard Class" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField name="is_hazardous" title="Is Substance Hazardous?" value={is_hazardous} className="col-lg-12"/>
                <Fragment ref="hazardous_details_sec" rendered={is_hazardous === 'Yes'}>
                    <ProfileField name="hazard_class_list" title="Hazard Class" value={hazard_class_list} renderer={v => v.join(', ')} className="col-lg-12"/>
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
                <ProfileField name="has_sds" title="Does It Have SDS?" value={has_sds} className={`col-lg-${has_sds === 'Yes' ? 6 : 12}`}/>
                <Fragment ref="sds_details_sec" rendered={has_sds === 'Yes'}>
                    <ProfileField name="sds_date" type="date" title="Safety Data Sheet Date" value={sds_date} className="col-lg-6"/>
                    
                    {sds && <ProfileField 
                        name="sds" 
                        title="Safety Data Sheet" 
                        value={sds} 
                        renderer={v => v.id} 
                        className="col-lg-12 margin-b-10"
                    />}
                    
                    {sds_doc && <UploadButton 
                        name="sds_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        defaultValue={sds_doc}
                        className="col-lg-6"
                        readonly
                    />}
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
                <ProfileField name="has_hazchem_sheet" title="Does It Have Hazchem Sheet?" value={has_hazchem_sheet} className={`col-lg-${has_hazchem_sheet === 'Yes' ? 6 : 12}`}/>
                <Fragment ref="hazchem_sheet_details_sec" rendered={has_hazchem_sheet === 'Yes'}>
                    <ProfileField name="hazchem_sheet_date" type="date" title="Hazchem Sheet Date" value={hazchem_sheet_date} className="col-lg-6"/>
                    
                    {hazchem_sheet && <ProfileField 
                        name="hazchem_sheet" 
                        title="Hazchem Sheet" 
                        value={hazchem_sheet} 
                        renderer={v => v.id} 
                        className="col-lg-12 margin-b-10"
                    />}
                    
                    {hazchem_sheet_doc && <UploadButton 
                        name="hazchem_sheet_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        defaultValue={hazchem_sheet_doc}
                        className="col-lg-6"
                        readonly
                    />}
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
                <ProfileField name="has_risk_assessment" title="Does It Have Risk Assessment?" value={has_risk_assessment} className={`col-lg-${has_risk_assessment === 'Yes' ? 6 : 12}`}/>
                <Fragment ref="risk_assessment_details_sec" rendered={has_risk_assessment === 'Yes'}>
                    <ProfileField name="risk_assessment_date" type="date" title="Risk Assessment Date" value={risk_assessment_date} className="col-lg-6"/>
                    <UploadButton 
                        name="risk_assessment_doc"
                        buttonTitle="Document (PDF, Word, Excel)" 
                        type={['Word', 'PDF', 'Excel']}
                        showOnlyIcon 
                        defaultValue={risk_assessment_doc}
                        className="col-lg-6"
                        readonly
                    />
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
                <NewPPEItemListTable name="ppe_type_list" defaultValue={ppe_type_list} readonly/>
            </Row>
            <Row 
                rendered 
                idx={12}
                title="12. Action / Comments" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <TinyMCE ref="action_or_comments" name="action_or_comments" defaultValue={action_or_comments} readonly height={300} open={true}/>
            </Row>
            <Row 
                rendered 
                idx={13}
                title="13. Stock Control" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <NewChemicalStockItemListTable name="chemical_stock_list" defaultValue={chemical_stock_list || []} readonly/>
            </Row>
            <ProfilePDFReader ref="pdfReader"/>
        </FormControls>;
    }
    // </editor-fold>

}

export default ProfileDialog;
