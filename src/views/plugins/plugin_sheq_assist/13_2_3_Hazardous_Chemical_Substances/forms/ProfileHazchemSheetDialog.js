// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import GridView from 'components/lists/GridView';

import ProfilePDFReader from '../printers/ProfileHazchemSheetPDFReader';

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
import {changeColors} from '../dialogs/Utils';

import style from "./ProfileHazchemSheetDialog.lazy.css";
import findByIdChemicalHazchemsheet
    from "mutations/all/Chemicals/ChemicalHazchemsheet/findByIdChemicalHazchemsheet";
import updateChemicalHazchemsheet
    from "mutations/all/Chemicals/ChemicalHazchemsheet/updateChemicalHazchemsheet";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileHazchemSheetDialog";
    findById = findByIdChemicalHazchemsheet;
    
    removeById = updateChemicalHazchemsheet ;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Hazchem Sheet";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.renderPhotographItem = this.renderPhotographItem.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {state, props: {dialog, execWhen}} = this;
        execWhen(() => this.item && this.item.data).then(({product}) => {
            execWhen(() => !!dialog && dialog.getDOMNode()).then(() => {
                changeColors(dialog, product.risk_level);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderPhotographItem">
    renderPhotographItem(item, n) {
        return <div key={"item-" + n} idx={n}>
            <div className="h-180 padding-0 margin-0">
                {RenderUtils.renderImage(item.doc)}
            </div>
        </div>;
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
                    product, sds,
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

        console.log('item', item);

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField name="client" title="Company" value={client}
                                               renderer={val => isString(val) ? val : (val.name || val.data.name)}
                                               className="col-lg-12"/>}
                <ProfileField name="project" title="Project" value={project}
                              renderer={val => isString(val) ? val : (val.name || val.data.name)}
                              className="col-lg-12"/>
                <ProfileField name="site" title="Site" value={site}
                              renderer={val => isString(val) ? val : (val.name || val.data.name)}
                              className="col-lg-12"/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Hazchem Sheet Details"
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormBack={!isNoProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 padding-0 pull-left">Link With Chemical Product If Available</label>
                <ProfileField name="product" placeholder="Product" value={product} renderer={v => v.name}
                              className="col-lg-12"/>
                <SelectedProduct product={product}/>
                
                <label className="col-lg-12 padding-0 pull-left">Link With SDS If Available</label>
                <ProfileField name="sds" placeholder="Safety Data Sheet (SDS)" value={sds} renderer={v => v.name}
                              className="col-lg-12"/>
                              
                <label className="col-lg-12 padding-0 pull-left">Other Basic Info</label>
                <ProfileField name="physical_state" placeholder="Physical State" value={physical_state}
                              className="col-lg-6"/>
                <ProfileField name="type" placeholder="Type" value={type} className="col-lg-6"/>
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
                        <GridView title="Picture(s)" renderItem={this.renderPhotographItem}
                                  list={precaution_photo_concentrate_list} className="grid-3 grid-gap-10 padding-10 -margin-t-5 -margin-b-10"/>
                    </Row>
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2 Precautions For Handling Application"
                        sectionClassName="-margin-r-10 padding-r-10"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <GridView title="Picture(s)" renderItem={this.renderPhotographItem}
                                  list={precaution_photo_application_list} className="grid-3 grid-gap-10 padding-10 -margin-t-5 -margin-b-10"/>
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
                                              readonly/>
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
                                                    defaultValue={hazard_identification_physical_list || []} readonly/>
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
                                                        readonly/>
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
                                                      readonly/>
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
                                                    readonly/>
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
                                                     readonly/>
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
                                                         readonly/>
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
                                                     readonly/>
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
                                                 defaultValue={emergency_action_for_spills_small_list || []} readonly/>
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
                                                 defaultValue={emergency_action_for_spills_large_list || []} readonly/>
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
                                                      defaultValue={disposal_used_container_list || []} readonly/>
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
                                                   defaultValue={disposal_unused_product_list || []} readonly/>
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
                        <label className="margin-0">Emergency</label>
                        <ProfileField name="contacts_emergency_name" type="text" placeholder="Contact Name"
                                      value={contacts_emergency_name} className="w-full margin-t-0 margin-r-0"/>
                        <ProfileField name="contacts_emergency_num" type="text" placeholder="Contact No."
                                      value={contacts_emergency_num} className="w-full margin-t-0 margin-r-0"/>
                    </div>
                    <div className="grid-1 grid-gap-5 padding-10 padding-t-5 bg-f8f8f8">
                        <label className="margin-0">Manufacturer</label>
                        <ProfileField name="contacts_manufacturer_name" type="text" placeholder="Contact Name"
                                      value={contacts_manufacturer_name} className="w-full margin-t-0 margin-r-0"/>
                        <ProfileField name="contacts_manufacturer_num" type="text" placeholder="Contact No."
                                      value={contacts_manufacturer_num} className="w-full margin-t-0 margin-r-0"/>
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
                    readonly
                />
            </Row>
            <ProfilePDFReader ref="pdfReader"/>
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;
