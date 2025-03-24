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
    SelectChemicalProductInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Fragment, Row} from 'components/FormComponents';

import {changeColors} from '../dialogs/Utils';

import riskLevelImg from 'img/risk-assessment.png';
import style from "./EditMSDSDialog.lazy.css";
import NewChemicalSupplierListTable from "components/FormTableComponents/NewChemicalSupplierListTable";

import {updateChemicalSDS} from "mutations/update";
import {findByIdChemicalSDS} from "mutations/findById";
import {insertChemicalSupplier} from "mutations/create";
import {deleteChemicalSupplier} from "mutations/delete";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditMSDSDialog extends AEditDialog {
    pageKey = "EditMSDSDialog";
    findById = findByIdChemicalSDS;
    removeById = updateChemicalSDS;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Safety Data Sheet";
    }

    get controls() {
        return Controls;
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
            risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {
                text: 'High',
                value: 'High'
            }, {text: 'Very High', value: 'Very High'}],
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

    get item() {
        return this.props.state.item;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {props: {dialog, execWhen}} = this;
        execWhen(() => this.item).then(val => {
            const {id, data: {product}} = val;
            this.onChangeProduct.call(this, null, product);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeProduct">
    onChangeProduct(el, val) {
        this.state.selectedProduct = val;
        const {props: {dialog, execWhen}} = this;
        execWhen(() => this.refs.product_info_sec).then(res => {
            if (val) {
                res.show();

                if (isObject(val)) {
                    const {
                        id,
                        data: {
                            //1
                            name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
                            category, physical_state, type,
                            application_or_use,
                            supplier_list,
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
                    execWhen(() => this.refs.supplier_list).then(ref => {
                        ref.value = supplier_list;
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
        const {props: {dialog, execWhen}} = this;
        execWhen(() => !!dialog && dialog.getDOMNode()).then(() => {
            changeColors(dialog, risk_level);
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
                _refs.filter(ref => !!ref && ref.isOpen).forEach(ref => ref.hide());
                const currRef = _refs.find((ref, idx) => idx === n);
                currRef && currRef.show();
            });
        };

        if (isNoProjects) {
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
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if (idx === 1) {
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
            client, project, site,
            //1
            product,
            name, common_names, chemical_name, empirical_formula, un_num,
            category, date_identified,//other added
            application_or_use,
            supplier_list,
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

        //1
        if (product && old_data.product) {
            if (product.id !== old_data.product.id) {
                const {id, name, risk_level, category, manufacturer, data: _data} = product;
                data.product = {
                    id,
                    name: name || _data.name,
                    risk_level: risk_level || _data.risk_level,
                    category: category || _data.category,
                    manufacturer: manufacturer || _data.manufacturer
                };
            }
        } else if (product) {
            const {id, name, risk_level, category, manufacturer, data: _data} = product;
            data.product = {
                id,
                name: name || _data.name,
                risk_level: risk_level || _data.risk_level,
                category: category || _data.category,
                manufacturer: manufacturer || _data.manufacturer
            };
        }
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, common_names, 'common_names');
        ShouldUpdate.check(data, old_data, chemical_name, 'chemical_name');
        ShouldUpdate.check(data, old_data, empirical_formula, 'empirical_formula');
        ShouldUpdate.check(data, old_data, un_num, 'un_num');
        ShouldUpdate.check(data, old_data, category, 'category');//other added
        ShouldUpdate.checkDate(data, old_data, date_identified, 'date_identified');//other added
        ShouldUpdate.check(data, old_data, application_or_use, 'application_or_use');
        // ShouldUpdate.check(data, old_data, supplier_list, 'supplier_list');
        ShouldUpdate.checkListToJS(data, old_data, emergency_phone_nums, 'emergency_phone_nums');
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
        ShouldUpdate.check(data, old_data, other_info, 'other_info');

        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateChemicalSDS({id: this.item.id, ...data}).then(res => {
            this.item.data.product = product;
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
                    //1
                    product,
                    name, common_names, chemical_name, empirical_formula, un_num,
                    category, date_identified,//other added
                    application_or_use,
                    supplier_list,
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..."
                                                    defaultValue={RenderUtils.selectedClient.call(this)} required
                                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..."
                                    defaultValue={RenderUtils.selectedProject.call(this)} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)}
                                 required className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                <SelectChemicalProductInput name="product" type="select" placeholder="Chemical Product..."
                                            defaultValue={product} className="col-lg-12 form-control margin-b-10"
                                            onChange={this.form.onChange}/>
                <Fragment ref="product_info_sec" rendered={false}>
                    <ClearableInput ref="name" name="name" type="text" placeholder="Product Name" defaultValue={name}
                                    required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="common_names" name="common_names" type="text"
                                    placeholder="Common Names / Synonyms" defaultValue={common_names} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="chemical_name" name="chemical_name" type="text" placeholder="Chemical Name"
                                    defaultValue={chemical_name} required className="col-lg-12 form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput ref="empirical_formula" name="empirical_formula" type="text"
                                    placeholder="Empirical Formula" defaultValue={empirical_formula} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="un_num" name="un_num" type="text" placeholder="UN Number" defaultValue={un_num}
                                    required className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <hr className="col-lg-12 margin-0"/>
                    <SelectChemicalCategoryInput ref="category" name="category" placeholder="Category..."
                                                 defaultValue={category} className="col-lg-12 form-control"
                                                 onChange={this.form.onChange}/>
                    <ClearableInput ref="date_identified" name="date_identified" type="date"
                                    placeholder="Date Identified..." defaultValue={date_identified} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Application / Use</label>
                    <ClearableInput ref="application_or_use" name="application_or_use" type="textarea"
                                    placeholder="Application / Use" defaultValue={application_or_use} required
                                    className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Manufacturer / Supplier</label>
                    <NewChemicalSupplierListTable
                        ref="supplier_list"
                        name="supplier_list"
                        defaultValue={[...(supplier_list || []), null]}
                        savable
                        targetItem={{key: "sds_id", item}}
                        insertFn={insertChemicalSupplier}
                        deleteFn={deleteChemicalSupplier}
                        onAttrs={onSupplierAttrs}
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Emergency Details</label>
                    <ClearableInput ref="emergency_phone_nums" name="emergency_phone_nums" type="select_multi"
                                    placeholder="Emergency Phone Numbers..." defaultValue={emergency_phone_nums}
                                    required className="col-lg-12 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.emergency_phone_nums} add returnValue/>

                    <label className="col-lg-12 margin-t-5 padding-0 pull-left">Risk Level</label>
                    <ClearableInput ref="risk_level" name="risk_level" type="radio" placeholder="Risk Level"
                                    defaultValue={risk_level} required className="col-lg-9 pull-left-1_5 form-control"
                                    onChange={this.form.onChange} values={this.state.lists.risk_level}/>
                    <p className="hor-center text-center padding-t-10 margin-t-20 w-full"><b>Please refer to the diagram
                        below</b></p>
                    <img src={riskLevelImg} width="100%"/>

                    <label className="col-lg-12 margin-t-5 margin-b-5 padding-0 pull-left">More Product
                        Information</label>
                    <TinyMCE ref="more_product_info" name="more_product_info" height={300} open={false}
                             defaultValue={more_product_info} onChange={this.form.onChange}/>
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
                <TinyMCE ref="composition_or_information_on_ingredients"
                         name="composition_or_information_on_ingredients" height={300} open={false}
                         defaultValue={composition_or_information_on_ingredients} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Hazards Identification"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="hazards_identification" name="hazards_identification" height={300} open={false}
                         defaultValue={hazards_identification} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. First Aid Measures & Precautions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="first_aid_measures_and_precautions" name="first_aid_measures_and_precautions" height={300}
                         open={false} defaultValue={first_aid_measures_and_precautions} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Firefighting Measures"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="firefighting_measures" name="firefighting_measures" height={300} open={false}
                         defaultValue={firefighting_measures} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Accidental Release Measures (Spillage)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="accidental_release_measures" name="accidental_release_measures" height={300} open={false}
                         defaultValue={accidental_release_measures} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Handling & Storage Requirements"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="handling_and_storage_requirements" name="handling_and_storage_requirements" height={300}
                         open={false} defaultValue={handling_and_storage_requirements} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. Exposure Controls / Personal Protection"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="exposure_controls_or_personal_protection" name="exposure_controls_or_personal_protection"
                         height={300} open={false} defaultValue={exposure_controls_or_personal_protection}
                         onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={9}
                title="9. Physical & Chemical Properties"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="physical_and_chemical_properties" name="physical_and_chemical_properties" height={300}
                         open={false} defaultValue={physical_and_chemical_properties} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={10}
                title="10. Stability & Reactivity"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="stability_and_reactivity" name="stability_and_reactivity" height={300} open={false}
                         defaultValue={stability_and_reactivity} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={11}
                title="11. Toxicological Information"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="toxicological_info" name="toxicological_info" height={300} open={false}
                         defaultValue={toxicological_info} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={12}
                title="12. Ecological Information"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="ecological_info" name="ecological_info" height={300} open={false}
                         defaultValue={ecological_info} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={13}
                title="13. Disposal Considerations"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="disposal_considerations" name="disposal_considerations" height={300} open={false}
                         defaultValue={disposal_considerations} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={14}
                title="14. Transport Information"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="transport_info" name="transport_info" height={300} open={false}
                         defaultValue={transport_info} onChange={this.form.onChange}/>
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
                <TinyMCE ref="regulatory_info" name="regulatory_info" height={300} open={false}
                         defaultValue={regulatory_info} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={16}
                title="16. Other Information"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <TinyMCE ref="other_info" name="other_info" height={300} open={false} defaultValue={other_info}
                         onChange={this.form.onChange}/>
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
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

function onSupplierAttrs(
    {
        manufacturer,
        email,
        phone,
        fax,
        website,
        address,
    }
) {
    return {
        manufacturer,
        email,
        phone,
        fax,
        website,
        address,
    };
}

export default EditMSDSDialog;
