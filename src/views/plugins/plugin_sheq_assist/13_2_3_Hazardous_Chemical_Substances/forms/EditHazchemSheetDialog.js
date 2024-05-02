// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, observable, toJS, computed} from 'mobx';

import Form from 'utils/Form';

import {ShouldUpdate} from "utils/Utils";
import {
    Button,
    ClearableInput,
    Clickable,
    SelectChemicalPhysicalStateInput,
    SelectChemicalProductInput,
    SelectChemicalTypesInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSDSProductInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Fragment, Row} from 'components/FormComponents';
import GridView from 'components/lists/GridView';
import {AEditDialog} from 'components/dialogs';

import {
    NewActiveIngredientListTable,
    NewBiologicalHazardListTable,
    NewContactWithSkinListTable,
    NewFumesBreathedInListTable,
    NewLargeSpillsListTable,
    NewMouthContactOrEatenListTable,
    NewPhysicalHazardListTable,
    NewReproductiveHazardListTable,
    NewSmallSpillsListTable,
    NewSplashesInEyesListTable,
    NewUnusedProductListTable,
    NewUsedContainersInListTable,
    SelectedProduct
} from '../dialogs/Components';
import {changeColors, onChangeHasProduct, onChangeHasSDS, onChangeProduct, onChangeSDS} from '../dialogs/Utils';

import style from "./EditHazchemSheetDialog.lazy.css";
import updateChemicalHazchemsheet
    from "mutations/all/Chemicals/ChemicalHazchemsheet/updateChemicalHazchemsheet";
import findByIdChemicalHazchemsheet from "mutations/all/Chemicals/ChemicalHazchemsheet/findByIdChemicalHazchemsheet";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditHazchemSheetDialog extends AEditDialog {
    pageKey = "EditHazchemSheetDialog";
    findById = findByIdChemicalHazchemsheet;
    removeById = updateChemicalHazchemsheet ;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Hazchem Sheet";
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/hazchem-sheet/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            emergency_phone_nums: [],
            has_product: ['Yes', 'No'].map(text => {
                return {text, value: text};
            }), 
            has_sds: ['Yes', 'No'].map(text => {
                return {text, value: text};
            })
        },
        selectedProduct: null,
        selectedSDS: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.onAddPhotograph = this.onAddPhotograph.bind(this);
        this.onRemovePhotograph = this.onRemovePhotograph.bind(this);
        this.renderPhotographItem = this.renderPhotographItem.bind(this);
        this.onLoadPhotographPlaceholderList = this.onLoadPhotographPlaceholderList.bind(this);

        this.form = new Form();
        this.form.addChangeOne("has_product", onChangeHasProduct.bind(this));
        this.form.addChangeOne("has_sds", onChangeHasSDS.bind(this));
        this.form.addChangeOne("product", onChangeProduct.bind(this));
        this.form.addChangeOne("sds", onChangeSDS.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {state, props: {dialog, execWhen}} = this;
        autorun(() => {
            const {selectedProduct} = this.state;
            const risk_level = selectedProduct ? selectedProduct.data.risk_level : null;
            execWhen(() => !!dialog && dialog.getDOMNode()).then(() => {
                changeColors(dialog, risk_level);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangeProduct">
    onChangeProduct(el, val) {
        this.state.selectedProduct = val;
        const {props: {dialog, execWhen}} = this;
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
                    execWhen(() => this.refs.physical_state).then(ref => {
                        ref.value = physical_state;
                    });
                    execWhen(() => this.refs.type).then(ref => {
                        ref.value = type;
                    });
                    //
//                    execWhen(() => this.refs.contacts_emergency_name).then(ref => {
//                        ref.value = ;
//                    });
                    execWhen(() => this.refs.contacts_emergency_num).then(ref => {
                        ref.value = emergency_phone_nums;
                    });
                    execWhen(() => this.refs.contacts_manufacturer_name).then(ref => {
                        ref.value = manufacturer;
                    });
                    execWhen(() => this.refs.contacts_manufacturer_num).then(ref => {
                        ref.value = manufacturer_phone_num;
                    });
                }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onAddPhotograph">
    onAddPhotograph(evt, btn) {
        const {refName, action, idx} = btn.props;
        if (action === 'self') {
            electronDialog.showOpenDialogImage().then(file => {
                this.refs[refName].list[idx] = file;
            });
        } else {
            electronDialog.showOpenDialogImage().then(file => {
                const {list} = this.refs[refName];
                let added = false;
                for (var n = 0; n < list.length; n++) {
                    if (list[n] === null) {
                        list[n] = file;
                        added = true;
                        break;
                    }
                }
                !added && list.push(file);
            });
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onRemovePhotograph">
    onRemovePhotograph(e, btn) {
        const {refName, idx} = btn.props;
        const {list} = this.refs[refName];
        if (list.length === 4) {
            list[idx] = null;
        } else {
            list.removeAt(idx);
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onLoadPhotographPlaceholderList">
    onLoadPhotographPlaceholderList(list) {
        return () => Promise.resolve(list);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPhotographItem">
    renderPhotographItem(refName) {
        return (item, n) => {
            return <div key={"item-" + n}>
                {!!item && <div className="h-180 padding-0 margin-0">
                    {item.doc && <img src={item.doc.dlUrls[0]}/>}
                    {!item.doc && <img src={item.previewPath ? item.previewPath : item.dlUrls[0]}/>}
                    <Clickable idx={n} refName={refName} onClick={this.onRemovePhotograph}><i
                        className="fa fa-times"></i></Clickable>
                </div>}
                {!item && <Clickable idx={n} refName={refName} action="self" onClick={this.onAddPhotograph}>
                    <div className="h-180 padding-0 margin-0">
                        <h3>Add Photo</h3>
                        <i className="fa fa-images"></i>
                    </div>
                </Clickable>}
            </div>;
        };
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="precaution_photo_concentrate_list, precaution_photo_application_list">
    get precaution_photo_concentrate_list() {
        return this.refs.precaution_photo_concentrateGridView.list.filter(val => !!val);
    }

    get precaution_photo_application_list() {
        return this.refs.precaution_photo_applicationGridView.list.filter(val => !!val);
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
            if (!form.isValid('has_product')) {
                infoDialog.open('Please select "Has Chemical Product?" option');
                return;
            } else if(form.get('has_product') === 'Yes' && !form.isValid('product')){
                infoDialog.open('Product is required');
                return;
            } 
            if (!form.isValid('has_sds')) {
                infoDialog.open('Please select "Has SDS?" option');
                return;
            } else if(form.get('has_sds') === 'Yes' && !form.isValid('sds')){
                infoDialog.open('Safety Data Sheet (SDS) is required');
                return;
            } 
            if (!form.isValid('physical_state')) {
                infoDialog.open('Physical State is required');
                return;
            }
            if (!form.isValid('type')) {
                infoDialog.open('Type is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {
            form,
            item: {data: old_data},
            precaution_photo_concentrate_list,
            precaution_photo_application_list
        } = this;
        
        const {isConsultant, isNoProjects} = storage.is;
        
        //0
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //1
        if (!form.isValid('has_product')) {
            infoDialog.open('Please select "Has Chemical Product?" option');
            return;
        } else if(form.get('has_product') === 'Yes' && !form.isValid('product')){
            infoDialog.open('Product is required');
            return;
        } 
        if (!form.isValid('has_sds')) {
            infoDialog.open('Please select "Has SDS?" option');
            return;
        } else if(form.get('has_sds') === 'Yes' && !form.isValid('sds')){
            infoDialog.open('Safety Data Sheet (SDS) is required');
            return;
        } 
            
        if (!form.isValid('physical_state')) {
            infoDialog.open('Physical State is required');
            return;
        }
        if (!form.isValid('type')) {
            infoDialog.open('Type is required');
            return;
        }

        const {
            client, project, site,
            //
            name,
            product, sds,
            physical_state,
            type,
            active_ingredient_list,
            hazard_identification_physical_list,
            hazard_identification_reproductive_list,
            hazard_identification_biological_list,
            first_aid_procedure_splashes_in_eyes_list,
            first_aid_procedure_contact_with_skin_list,
            first_aid_procedure_mouth_contact_or_eaten_list,
            first_aid_procedure_fumes_breathed_in_list,
            emergency_action_for_spills_small_list,
            emergency_action_for_spills_large_list,
            disposal_used_container_list,
            disposal_unused_product_list,
            contacts_emergency_name,
            contacts_emergency_num,
            contacts_manufacturer_name,
            contacts_manufacturer_num,

            doc
        } = form.data;
        const data = {
        };
        //
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        //1
        ShouldUpdate.check(data, old_data, name, 'name');
        
        if(product && old_data.product) {
            if(product.id !== old_data.product.id) {
                data.product_id = product.id;
            }
        } else if(product) {
            data.product_id = product.id;
        }
        //[path]

        const new_pre_photo_con_list = precaution_photo_concentrate_list.filter(({path}) => !!path).map(({path}) => path);
        const old_pre_photo_con_list = precaution_photo_concentrate_list.filter(({path}) => !path);
        data.precaution_photo_concentrate_list = [...old_pre_photo_con_list, ...new_pre_photo_con_list];

        const new_pre_photo_app_list = precaution_photo_application_list.filter(({path}) => !!path).map(({path}) => path);
        const old_pre_photo_app_list = precaution_photo_application_list.filter(({path}) => !path);
        data.precaution_photo_application_list = [...old_pre_photo_app_list, ...new_pre_photo_app_list];

        if (active_ingredient_list) {
            data.active_ingredient_list = active_ingredient_list;
        }

        if (hazard_identification_physical_list) {
            data.hazard_identification_physical_list = hazard_identification_physical_list;
        }
        if (hazard_identification_reproductive_list) {
            data.hazard_identification_reproductive_list = hazard_identification_reproductive_list;
        }
        if (hazard_identification_biological_list) {
            data.hazard_identification_biological_list = hazard_identification_biological_list;
        }

        if (first_aid_procedure_splashes_in_eyes_list) {
            data.first_aid_procedure_splashes_in_eyes_list = first_aid_procedure_splashes_in_eyes_list;
        }
        if (first_aid_procedure_contact_with_skin_list) {
            data.first_aid_procedure_contact_with_skin_list = first_aid_procedure_contact_with_skin_list;
        }
        if (first_aid_procedure_mouth_contact_or_eaten_list) {
            data.first_aid_procedure_mouth_contact_or_eaten_list = first_aid_procedure_mouth_contact_or_eaten_list;
        }
        if (first_aid_procedure_fumes_breathed_in_list) {
            data.first_aid_procedure_fumes_breathed_in_list = first_aid_procedure_fumes_breathed_in_list;
        }

        if (emergency_action_for_spills_small_list) {
            data.emergency_action_for_spills_small_list = emergency_action_for_spills_small_list;
        }
        if (emergency_action_for_spills_large_list) {
            data.emergency_action_for_spills_large_list = emergency_action_for_spills_large_list;
        }

        if (disposal_used_container_list) {
            data.disposal_used_container_list = disposal_used_container_list;
        }
        if (disposal_unused_product_list) {
            data.disposal_unused_product_list = disposal_unused_product_list;
        }

        if (contacts_emergency_name) {
            data.contacts_emergency_name = contacts_emergency_name;
        }
        if (contacts_emergency_num) {
            data.contacts_emergency_num = toJS(contacts_emergency_num);
        }
        if (contacts_manufacturer_name) {
            data.contacts_manufacturer_name = contacts_manufacturer_name;
        }
        if (contacts_manufacturer_num) {
            data.contacts_manufacturer_num = contacts_manufacturer_num;
        }

        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateChemicalHazchemsheet({id: this.item.id, ...data}).then(res => {
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

    // </editor-fold>

    @computed
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
                    product,
                    sds,
                    physical_state,
                    type,
                    precaution_photo_concentrate_list,
                    precaution_photo_application_list,
                    active_ingredient_list,
                    hazard_identification_physical_list,
                    hazard_identification_reproductive_list,
                    hazard_identification_biological_list,
                    first_aid_procedure_splashes_in_eyes_list,
                    first_aid_procedure_contact_with_skin_list,
                    first_aid_procedure_mouth_contact_or_eaten_list,
                    first_aid_procedure_fumes_breathed_in_list,
                    emergency_action_for_spills_small_list,
                    emergency_action_for_spills_large_list,
                    disposal_used_container_list,
                    disposal_unused_product_list,
                    contacts_emergency_name,
                    contacts_emergency_num,
                    contacts_manufacturer_name,
                    contacts_manufacturer_num,
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
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Hazchem Sheet Details"
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput name="has_product" type="radio" placeholder="Has Chemical Product?" vertical className="col-lg-6 hor-center form-control" onChange={this.form.onChange} values={this.state.lists.has_product} returnValue/>
                <Fragment ref="product_details_sec" rendered={false}>
                    <label className="col-lg-6 hor-center text-center padding-0">Link With Chemical Product If Available</label>
                    <SelectChemicalProductInput name="product" placeholder="Chemical Product..." defaultValue={product} className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                    <SelectedProduct state={this.state}/>
                </Fragment>
                
                <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                
                <ClearableInput name="has_sds" type="radio" placeholder="Has SDS?" vertical className="col-lg-6 hor-center margin-t-15 form-control" onChange={this.form.onChange} values={this.state.lists.has_sds} returnValue/>
                <Fragment ref="sds_details_sec" rendered={false}>
                    <label className="col-lg-6 hor-center text-center padding-0">Link With SDS If Available</label>
                    <SelectSDSProductInput name="sds" type="select" placeholder="Safety Data Sheet (SDS)..." defaultValue={sds} className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                </Fragment>
                
                <hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
                
                <label className="col-lg-6 hor-center text-center padding-0">Other Basic Info</label>
                <ClearableInput ref="name" name="name" type="text" placeholder="Chemical Name" className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
                
                <SelectChemicalPhysicalStateInput name="physical_state" placeholder="Physical State..."
                                                  defaultValue={physical_state} className="col-lg-6 hor-center form-control"
                                                  onChange={this.form.onChange}/>
                <SelectChemicalTypesInput name="type" placeholder="Type..." defaultValue={type}
                                          className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Precaution Photo Details"
                className="row-photos"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={2.1}
                        title="2.1 Precautions For Handling Concentrate"
                        sectionClassName="-margin-r-10 padding-r-10"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <GridView ref="precaution_photo_concentrateGridView" title="Add Photo"
                                  renderItem={this.renderPhotographItem("precaution_photo_concentrateGridView")}
                                  onLoadList={this.onLoadPhotographPlaceholderList(precaution_photo_concentrate_list)}
                                  className="grid-3 grid-gap-10 padding-10 -margin-t-5 -margin-b-10"
                        />
                        <Button className="btn btn-primary hor-center" refName="precaution_photo_concentrateGridView"
                                onClick={this.onAddPhotograph}>Add Photo</Button>
                    </Row>
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2 Precautions For Handling Application"
                        sectionClassName="-margin-r-10 padding-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <GridView ref="precaution_photo_applicationGridView" title="Add Photo"
                                  renderItem={this.renderPhotographItem("precaution_photo_applicationGridView")}
                                  onLoadList={this.onLoadPhotographPlaceholderList(precaution_photo_application_list)}
                                  className="grid-3 grid-gap-10 padding-10 -margin-t-5 -margin-b-10"
                        />
                        <Button className="btn btn-primary hor-center" refName="precaution_photo_applicationGridView"
                                onClick={this.onAddPhotograph}>Add Photo</Button>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Active Ingredients"
                className="row-photos"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewActiveIngredientListTable name="active_ingredient_list" defaultValue={active_ingredient_list || []}
                                              onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Hazard Identification"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={4.1}
                        title="4.1 Physical Hazards"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewPhysicalHazardListTable name="hazard_identification_physical_list"
                                                    defaultValue={hazard_identification_physical_list || []}
                                                    onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={4.2}
                        title="4.2 Reproductive Hazards"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <NewReproductiveHazardListTable name="hazard_identification_reproductive_list"
                                                        defaultValue={hazard_identification_reproductive_list || []}
                                                        onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={4.3}
                        title="4.3 Biological Hazards"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewBiologicalHazardListTable name="hazard_identification_biological_list"
                                                      defaultValue={hazard_identification_biological_list || []}
                                                      onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. First Aid Procedures"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={5.1}
                        title="5.1 Splashes in Eyes"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewSplashesInEyesListTable name="first_aid_procedure_splashes_in_eyes_list"
                                                    defaultValue={first_aid_procedure_splashes_in_eyes_list || []}
                                                    onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={5.2}
                        title="5.2 Contact with Skin"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <NewContactWithSkinListTable name="first_aid_procedure_contact_with_skin_list"
                                                     defaultValue={first_aid_procedure_contact_with_skin_list || []}
                                                     onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={5.3}
                        title="5.3 Mouth Contact or Eaten"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <NewMouthContactOrEatenListTable name="first_aid_procedure_mouth_contact_or_eaten_list"
                                                         defaultValue={first_aid_procedure_mouth_contact_or_eaten_list || []}
                                                         onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={5.4}
                        title="5.4 Fumes Breathed In"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewFumesBreathedInListTable name="first_aid_procedure_fumes_breathed_in_list"
                                                     defaultValue={first_aid_procedure_fumes_breathed_in_list || []}
                                                     onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Emergency Action For Spills"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={6.1}
                        title="6.1 Small Spills (<= 10 Litres)"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewSmallSpillsListTable name="emergency_action_for_spills_small_list"
                                                 defaultValue={emergency_action_for_spills_small_list || []}
                                                 onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={6.2}
                        title="6.2 Large Spills (> 10 Litres)"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewLargeSpillsListTable name="emergency_action_for_spills_large_list"
                                                 defaultValue={emergency_action_for_spills_large_list || []}
                                                 onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Disposal"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={7.1}
                        title="7.1 Used Containers"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewUsedContainersInListTable name="disposal_used_container_list"
                                                      defaultValue={disposal_used_container_list || []}
                                                      onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={7.2}
                        title="7.2 Unused Product"
                        sectionClassName="-margin-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewUnusedProductListTable name="disposal_unused_product_list"
                                                   defaultValue={disposal_unused_product_list || []}
                                                   onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. Contact Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <div className="grid-2 grid-gap-10 padding-t-5 margin-r-10">
                    <div className="grid-1 grid-gap-5 padding-10 padding-t-5 bg-f8f8f8">
                        <label className="margin-0 margin-b-5">Emergency</label>
                        <ClearableInput name="contacts_emergency_name" type="text" placeholder="Emergency Contact Name"
                                        defaultValue={contacts_emergency_name}
                                        className="w-full margin-b-10 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="contacts_emergency_num" 
                                        name="contacts_emergency_num" type="select_multi" 
                                        placeholder="Emergency Contact No. ..." className="w-full form-control"
                                        defaultValue={contacts_emergency_num}
                                        onChange={this.form.onChange} 
                                        values={this.state.lists.emergency_phone_nums} add returnValue/>
                    </div>
                    <div className="grid-1 grid-gap-5 padding-10 padding-t-5 bg-f8f8f8">
                        <label className="margin-0 margin-b-5">Manufacturer</label>
                        <ClearableInput name="contacts_manufacturer_name" type="text" placeholder="Manufacturer Contact Name"
                                        defaultValue={contacts_manufacturer_name}
                                        className="w-full margin-b-10 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contacts_manufacturer_num" type="text" placeholder="Manufacturer Contact No."
                                        defaultValue={contacts_manufacturer_num} className="w-full form-control"
                                        onChange={this.form.onChange}/>
                    </div>
                </div>
            </Row>
            <Row
                rendered
                idx={9}
                title="9. Document"
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

export default EditHazchemSheetDialog;
