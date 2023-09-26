import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {getGeocode} from 'utils/Maps';
import {Dates, execWhen} from 'utils/Utils';

import {
	ClearableInput, ProfileField,
	SelectCityInput, SelectCountryInput,
	SelectDepartmentInput,
	SelectEmployeeInput,
	SelectJobPositionInput, SelectZoneInput, UploadButton
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {SliderWithChildren} from "components/lists";
import {CreateAndEditBar} from "components/FormComponents";
import {extendObservable} from "mobx";
import NewDocBankingDetailsDialog from "./profile_forms/NewDocBankingDetailsDialog";
import EditDocBankingDetailsDialog from "./profile_forms/EditDocBankingDetailsDialog";
import LivingAddressSection from "./LivingAddressSection";
import BankingDetailsSection from "./BankingDetailsSection";

@observer
class EditOptionalInfoSection extends React.Component {
	pageKey = "EditOptionalInfoSection";

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.form = new Form();
		this.form.addChangeOne("supervisor", this.onChangeEmployee.bind(this));
	}

	//</editor-fold>

	//<editor-fold desc="componentDidMount">
	componentDidMount() {
		execWhen(() => this.refs.living_addr_country &&
			this.refs.living_addr_province &&
			this.refs.living_addr_city
		).then(() => {
			const {
				living_addr_country: country_ref,
				living_addr_province: province_ref,
				living_addr_city: city_ref,
			} = this.refs;
			const {
				item: {
					data: {living_address_list}
				}
			} = this.props;
			if (living_address_list && living_address_list.anyMatch) {
				if (living_address_list.anyMatch(v => v.province)) {
					return;
				}
			}
			getGeocode().then(res => {
				const {city, region, country} = res;
				country_ref.onChange(country);
				province_ref.onChange(region);
				city_ref.onChange(city);
			}).catch(err => {
				console.error(err)
			});
		});
	}

	//</editor-fold>

	//<editor-fold desc="onChangeEmployee">
	onChangeEmployee(el, val) {
		execWhen(() => this.refs.supervisor_phone && this.refs.supervisor_email).then(() => {
			const {
				supervisor_phone: supervisor_phone_ref, supervisor_email: supervisor_email_ref
			} = this.refs;
			if (val) {
				if (val.data) {
					const {phone, email} = val.data;
					phone && supervisor_phone_ref.onChange(phone);
					email && supervisor_email_ref.onChange(email);
				}
			} else {
				supervisor_phone_ref.reset();
				supervisor_email_ref.reset();
			}
		});
	}

	//</editor-fold>

	//<editor-fold desc="formData">
	get formData() {
		const {data} = this.form;
		let {
			//
			employment_date,
			employment_num,
			department,
			job_position,
			//
			supervisor,
			supervisor_phone,
			supervisor_email,
			//
			living_address_list,
			//
			banking_detail_list,
		} = data;

		return {
			//
			employment_date: Dates.formatDateSQL(employment_date),
			employment_num,
			job_position_id: job_position && job_position.id,
			department_id: department && department.id,
			//
			supervisor_id: supervisor && supervisor.id,
			//
			living_address_list: {
				data: (living_address_list || []).map(({country, province, city, local_address, street_address, doc}) => ({
					is_default: true,
					//1
					country_id: country.id,
					province_id: province.id,
					city_id: city.id,
					local_address,
					street_address,
					//2
					doc: doc && doc.path,
				}))
			},
			banking_detail_list: {
				data: (banking_detail_list || []).map(({name, branch, code, account_num, doc}) => ({
					is_default: true,
					//1
					name,
					branch,
					code,
					account_num,
					//2
					doc: doc && doc.path,
				}))
			},
		}
	}

	//</editor-fold>

	//<editor-fold desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen, onFormSave, item, idx} = this.props;

		let {
			id,
			department, job_position, supervisor,
			employment_date, employment_num,
		} = (item && item.data) || {};

		const isNewEmployee = !id;

		const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
		return <div id={this.pageKey + "-tab"} className={className}>
			<div className="controls-wrapper controls-sectioned">
				<div className="controls">
					<Row
						active
						rendered
						idx={parseFloat(idx + ".1").toFixed(1)}
						title={idx + ".1 Employment Details"}
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormSave={onFormSave}
					>
						<ClearableInput name="employment_date" type="date" placeholder="Date of Employment..."
						                defaultValue={employment_date} required className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
						<ClearableInput name="employment_num" type="text" placeholder="Company No. / Employee ID"
						                defaultValue={employment_num} className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
						<SelectDepartmentInput name="department" placeholder="Department..." defaultValue={department}
						                       className="col-lg-12 form-control" onChange={this.form.onChange}/>
						<SelectJobPositionInput name="job_position" placeholder="Job Position..."
						                        defaultValue={job_position} className="col-lg-12 form-control"
						                        onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={parseFloat(idx + ".2").toFixed(1)}
						title={idx + ".2 Supervisor Details"}
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormBack={onFormBack}
						onFormSave={onFormSave}
					>
						<SelectEmployeeInput name="supervisor" placeholder="Supervisor Name..."
						                     defaultValue={supervisor} className="col-lg-12 form-control"
						                     onChange={this.form.onChange}/>
						<ClearableInput ref="supervisor_phone" name="supervisor_phone" type="text"
						                placeholder="Supervisor Phone No." defaultValue={supervisor && supervisor.phone}
						                className="col-lg-12 form-control" onChange={this.form.onChange}/>
						<ClearableInput ref="supervisor_email" name="supervisor_email" type="email"
						                placeholder="Supervisor Email Address"
						                defaultValue={supervisor && supervisor.email} className="col-lg-12 form-control"
						                onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={parseFloat(idx + ".3").toFixed(1)}
						title={idx + ".3 Living Address"}
						sectionClassName="h-440 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
						onFormOpen={onFormOpen}
						onFormNext={onFormNext}
						onFormBack={onFormBack}
						onFormSave={onFormSave}
					>
						<LivingAddressSection item={item} isNewEmployee={isNewEmployee} isEmbedded onChange={this.form.onChange}/>
					</Row>
					<Row
						rendered
						idx={parseFloat(idx + ".4").toFixed(1)}
						title={idx + ".4 Banking Details"}
						sectionClassName="h-370 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
						onFormOpen={onFormOpen}
						onFormBack={onFormBack}
					>
						<BankingDetailsSection item={item} isNewEmployee={isNewEmployee} isEmbedded onChange={this.form.onChange}/>
					</Row>
				</div>
			</div>
		</div>
	}

	//</editor-fold>
}

export default EditOptionalInfoSection;