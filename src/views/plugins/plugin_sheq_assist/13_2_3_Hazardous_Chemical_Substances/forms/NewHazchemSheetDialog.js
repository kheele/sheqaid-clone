// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {execWhen, toDataURI} from "utils/Utils";
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
import ANewDialog from 'components/dialogs/ANewDialog';

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

import style from "./NewHazchemSheetDialog.lazy.css";
import insertChemicalHazchemsheet
	from "mutations/all/Chemicals/ChemicalHazchemsheet/insertChemicalHazchemsheet";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewHazchemSheetDialog extends ANewDialog {
	pageKey = "NewHazchemSheetDialog";
	title = "Create Hazchem Sheet";
	
	constructor(props) {
		super(props, style);
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
	onLoadPhotographPlaceholderList(refName) {
		return () => {
			return new Promise((resolve, reject) => {
				execWhen(() => this.refs[refName]).then(({list}) => {
					const min = 4;
					if (list.isEmpty()) {
						const nullList = [];
						for (var n = 1; n <= min; n++) {
							nullList.push(null);
						}
						resolve(nullList);
					} else if (list.filter(item => !!item).isEmpty()) {
						resolve(list);
					} else {
						//const
						resolve();
					}
				});
			});
		};
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderPhotographItem">
	renderPhotographItem(refName) {
		return (item, n) => {
			return <div key={"item-" + n} className="col-lg-6">
				{!!item && <div>
					<img src={item.previewPath}/>
					<Clickable idx={n} refName={refName} onClick={this.onRemovePhotograph}><i
						className="fa fa-times"></i></Clickable>
				</div>}
				{!item && <Clickable idx={n} refName={refName} action="self" onClick={this.onAddPhotograph}>
					<div>
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
		if (idx === 0) {
			const {isConsultant} = storage.is;
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
		}
		if (idx === 1) {
			if (!form.isValid('has_product')) {
				infoDialog.open('Please select "Has Chemical Product?" option');
				return;
			} else if (form.get('has_product') === 'Yes' && !form.isValid('product')) {
				infoDialog.open('Product is required');
				return;
			}
			if (!form.isValid('has_sds')) {
				infoDialog.open('Please select "Has SDS?" option');
				return;
			} else if (form.get('has_sds') === 'Yes' && !form.isValid('sds')) {
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
	async onSubmit(e, btn, onSaved) {
		const {form, precaution_photo_concentrate_list, precaution_photo_application_list} = this;
		
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
		} else if (form.get('has_product') === 'Yes' && !form.isValid('product')) {
			infoDialog.open('Product is required');
			return;
		}
		if (!form.isValid('has_sds')) {
			infoDialog.open('Please select "Has SDS?" option');
			return;
		} else if (form.get('has_sds') === 'Yes' && !form.isValid('sds')) {
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
			//0
			client,
			project,
			site,
			//1
			name,
			physical_state,
			type,
			product,
			sds,
			//3
			active_ingredient_list,
			//4
			hazard_identification_physical_list,
			hazard_identification_reproductive_list,
			hazard_identification_biological_list,
			//5
			first_aid_procedure_splashes_in_eyes_list,
			first_aid_procedure_contact_with_skin_list,
			first_aid_procedure_mouth_contact_or_eaten_list,
			first_aid_procedure_fumes_breathed_in_list,
			//6
			emergency_action_for_spills_small_list,
			emergency_action_for_spills_large_list,
			//7
			disposal_used_container_list,
			disposal_unused_product_list,
			//8
			contacts_emergency_name,
			contacts_emergency_num,
			contacts_manufacturer_name,
			contacts_manufacturer_num,
			//9
			doc
		} = form.data;
		const data = {
			//0
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//1
			name,
			physical_state,
			type,
			product_id: product && product.id,
			sds_id: sds && sds.id,
			//2
			precaution_photo_list: {
				data: [
					...(precaution_photo_concentrate_list || []).map((doc) => ({
						doc,
						type: "Concentrate"
					})),
					...(precaution_photo_application_list || []).map((doc) => ({
						doc,
						type: "Application"
					}))
				],
			},
			//3, 4, 5, 6, 7
			list: {
				data: [
					//3
					//active_ingredient_list
					...(active_ingredient_list || []).map(({text: value}) => ({
						value,
						group: "Active Ingredient",
					})),
					//4
					//hazard_identification_physical_list
					...(hazard_identification_physical_list || []).map(({text: value}) => ({
						value,
						group: "Hazard Identification",
						type: "Physical",
					})),
					//hazard_identification_reproductive_list
					...(hazard_identification_reproductive_list || []).map(({text: value}) => ({
						value,
						group: "Hazard Identification",
						type: "Reproductive",
					})),
					//hazard_identification_biological_list
					...(hazard_identification_biological_list || []).map(({text: value}) => ({
						value,
						group: "Hazard Identification",
						type: "Biological",
					})),
					//5
					//first_aid_procedure_splashes_in_eyes_list: {
					...(first_aid_procedure_splashes_in_eyes_list || []).map(({text: value}) => ({
						value,
						group: "First Aid Procedure",
						type: "Splashes In Eyes",
					})),
					//first_aid_procedure_contact_with_skin_list: {
					...(first_aid_procedure_contact_with_skin_list || []).map(({text: value}) => ({
						value,
						group: "First Aid Procedure",
						type: "Contact with Skin",
					})),
					//first_aid_procedure_mouth_contact_or_eaten_list: {
					...(first_aid_procedure_mouth_contact_or_eaten_list || []).map(({text: value}) => ({
						value,
						group: "First Aid Procedure",
						type: "Mouth Contact or Eaten",
					})),
					//first_aid_procedure_fumes_breathed_in_list: {
					...(first_aid_procedure_fumes_breathed_in_list || []).map(({text: value}) => ({
						value,
						group: "First Aid Procedure",
						type: "Fumes Breathed In",
					})),
					//6
					//emergency_action_for_spills_small_list
					...(emergency_action_for_spills_small_list || []).map(({text: value}) => ({
						value,
						group: "Emergency Action For Spills",
						type: "Small Spills",
					})),
					//emergency_action_for_spills_large_list
					...(emergency_action_for_spills_large_list || []).map(({text: value}) => ({
						value,
						group: "Emergency Action For Spills",
						type: "Large Spills",
					})),
					//7
					//disposal_used_container_list
					...(disposal_used_container_list || []).map(({text: value}) => ({
						value,
						group: "Disposal",
						type: "Used Containers",
					})),
					//disposal_unused_product_list
					...(disposal_unused_product_list || []).map(({text: value}) => ({
						value,
						group: "Disposal",
						type: "Unused Product",
					})),
				]
			},
			//8
			contacts_emergency_name,
			contacts_emergency_num,
			contacts_manufacturer_name,
			contacts_manufacturer_num,
			//9
			doc,
		};
		
		console.log(data)
		
		btn.text("Saving...").disabled();
		progressDialog.open();
		insertChemicalHazchemsheet(data).then(res => {
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
				{isConsultant && <SelectClientInput name="client" placeholder="Company..." required
				                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>}
				<SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control"
				                    onChange={this.form.onChange}/>
				<SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control"
				                 onChange={this.form.onChange}/>
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
				<ClearableInput name="has_product" type="radio" placeholder="Has Chemical Product?" vertical
				                className="col-lg-6 hor-center form-control" onChange={this.form.onChange}
				                values={this.state.lists.has_product} returnValue/>
				<Fragment ref="product_details_sec" rendered={false}>
					<label className="col-lg-6 hor-center text-center padding-0">Link With Chemical Product If
						Available</label>
					<SelectChemicalProductInput name="product" placeholder="Chemical Product..."
					                            defaultValue={this.chemicalSelected}
					                            className="col-lg-6 hor-center form-control"
					                            onChange={this.form.onChange}/>
					<SelectedProduct state={this.state}/>
				</Fragment>
				
				<hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
				
				<ClearableInput name="has_sds" type="radio" placeholder="Has SDS?" vertical
				                className="col-lg-6 hor-center margin-t-15 form-control" onChange={this.form.onChange}
				                values={this.state.lists.has_sds} returnValue/>
				<Fragment ref="sds_details_sec" rendered={false}>
					<label className="col-lg-6 hor-center text-center padding-0">Link With SDS If Available</label>
					<SelectSDSProductInput name="sds" type="select" placeholder="Safety Data Sheet (SDS)..."
					                       className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
				</Fragment>
				
				<hr className="col-lg-12 margin-t-5 margin-b-20 margin-r-5"/>
				
				<label className="col-lg-6 hor-center text-center padding-0">Other Basic Info</label>
				<ClearableInput ref="name" name="name" type="text" placeholder="Chemical Name"
				                className="col-lg-6 hor-center form-control" onChange={this.form.onChange}/>
				
				<SelectChemicalPhysicalStateInput ref="physical_state" name="physical_state"
				                                  placeholder="Physical State..."
				                                  className="col-lg-6 hor-center form-control"
				                                  onChange={this.form.onChange}/>
				<SelectChemicalTypesInput ref="type" name="type" placeholder="Type..."
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
						          onLoadList={this.onLoadPhotographPlaceholderList("precaution_photo_concentrateGridView")}/>
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
						          onLoadList={this.onLoadPhotographPlaceholderList("precaution_photo_applicationGridView")}/>
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
				<NewActiveIngredientListTable name="active_ingredient_list" onChange={this.form.onChange}/>
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
						<NewUnusedProductListTable name="disposal_unused_product_list" onChange={this.form.onChange}/>
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
						<ClearableInput ref="contacts_emergency_name" name="contacts_emergency_name" type="text"
						                placeholder="Emergency Contact Name" className="w-full margin-b-10 form-control"
						                onChange={this.form.onChange}/>
						<ClearableInput ref="contacts_emergency_num" name="contacts_emergency_num" type="select_multi"
						                placeholder="Emergency Contact No. ..." className="w-full form-control"
						                onChange={this.form.onChange} values={this.state.lists.emergency_phone_nums} add
						                returnValue/>
					</div>
					<div className="grid-1 grid-gap-5 padding-10 padding-t-5 bg-f8f8f8">
						<label className="margin-0 margin-b-5">Manufacturer</label>
						<ClearableInput ref="contacts_manufacturer_name" name="contacts_manufacturer_name" type="text"
						                placeholder="Manufacturer Contact Name" className="w-full margin-b-10 form-control"
						                onChange={this.form.onChange}/>
						<ClearableInput ref="contacts_manufacturer_num" name="contacts_manufacturer_num" type="text"
						                placeholder="Manufacturer Contact No." className="w-full form-control"
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
					className="col-lg-6 hor-center"
					onChange={this.form.onChange}
				/>
			</Row>
		</FormControls>;
	}
	
	// </editor-fold>
}

export default NewHazchemSheetDialog;
