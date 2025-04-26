import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

import Form from 'utils/Form';

import {Button, ProfileField, ProfilePic} from 'components/inputs';

import style from "./CompanyProfile.lazy.css";

@observer
class CompanyProfile extends React.Component {

	constructor() {
		super();

		this.onEdit = this.onEdit.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.onUploaded = this.onUploaded.bind(this);

		this.form = new Form();
	}

	componentDidMount() {
		style.use();
		setTimeout(function () {
			$(findDOMNode(this)).showScrollbars(0.8, "rgb(2,168,168)");
		}.bind(this), 0);
	}

	componentWillUnmount() {
		style.unuse();
		$(findDOMNode(this)).removeScrollbars();
	}

	onEdit(e, btn) {
		if (btn.text().contains('Edit')) {
			Object.values(this.refs).forEach(input => {
				input.setEditable(true);
			});
			btn.text('Save');
		} else {
			this.onSubmit(e, btn);
		}
	}

	onSubmit(e, btn) {
		const {form} = this;

		if (!form.isValid('name')) {
			infoDialog.open('Company Name is');
			return;
		}
		if (!form.isValid('email')) {
			infoDialog.open('Company Email Address is');
			return;
		}
		if (!form.isValid('phone')) {
			infoDialog.open('Company Phone Number is');
			return;
		}
		if (!form.isValid('country')) {
			infoDialog.open('Country is');
			return;
		}
		if (!form.isValid('city')) {
			infoDialog.open('City is');
			return;
		}

		const {name, company_owner, company_owner_email, address, phone, email, country, city} = form.data;
		const data = {};
		if (name) {
			data.name = name;
		}
		if (phone) {
			data.phone = phone;
		}
		if (email) {
			data.email = email;
		}
		if (country) {
			data.country = country;
		}
		if (city) {
			data.city = city;
		}

		if (company_owner) {
			data.company.company_owner = company_owner;
		}
		if (company_owner_email) {
			data.company.company_owner_email = company_owner_email;
		}
		if (address) {
			data.company.address = address;
		}
		console.log(data)

		btn.text("Saving...").disabled();
		workers.emit("users/update/profile/company", data).then(res => {
			btn.text("Edit Profile").enabled();
			Object.values(this.refs).forEach(input => {
				input.setEditable(false);
			});
			console.log("res", res)
			extendObservable(storage.loggedUser.company.data, data);
			storage.update.updateDBUser(storage.loggedUser);
			infoDialog.open("Record successfully updated.");
			setTimeout(function () {
				infoDialog.close();
			}.bind(this), 2000);
		}).catch(e => {
			btn.text("Save").enabled();
		});
	}

	onUploaded(path) {
		storage.loggedUser.company.data.profile_pic = path;
		storage.update.updateDBUser(storage.loggedUser);
	}

	render() {
		const {id,
			data: {
				account_type,
				consultant,
				name,
				category,
				address,
				phone,
				email,
				country,
				zone,
				city,
				profile_pic
			}
		} = storage.loggedUser.company;
//        console.log(storage.loggedUser.company)
		const {isEmployee, isContractor, isConsultant, isTrial} = storage.is;
		return <div className="CompanyProfile hor-center col-lg-6">
			<h3>
				Company Profile
				{!isEmployee && !isContractor &&
					<Button className="btn btn-primary pull-right" onClick={this.onEdit}>Edit Profile</Button>}
			</h3>
			<div className="nice-scrollbars">
				<div className="col-lg-12 profile-name-panel">
					{(isEmployee || isContractor) && <ProfilePic readonly profilePic={profile_pic}/>}
					{!isEmployee && !isContractor &&
						<ProfilePic path="users/update/upload/profile-pic/company" profilePic={profile_pic}
						            onUploaded={this.onUploaded}/>}
					<h4>{name}</h4>
				</div>
				<div className="controls-wrapper">
					<div className="controls">
						<div className="row">
							<div className="row sec-group">
								<ProfileField ref="account_type" name="account_type" placeholder="Account Type"
								              value={account_type + " Version"} className="col-lg-6"/>
								<ProfileField ref="consultant" name="consultant" placeholder="Account Group"
								              value={consultant ? "Consultant" : "Client"} className="col-lg-6"/>
								{isTrial &&
									<p className="col-lg-12 margin-t-10 margin-b-0 text-left"><b>{storage.trialDaysLeft} days left</b> for
										your trial period</p>}
							</div>
							<div className="row sec-group">
								<ProfileField ref="name" name="name" placeholder="Company Name" value={name} className="col-lg-12"/>
								{!consultant && <ProfileField ref="category" name="category" placeholder="Company Category" value={category} renderer={v => v.name}
								              className="col-lg-12"/>}
							</div>
							<div className="row sec-group">
								<ProfileField ref="email" name="email" type="email" placeholder="Company Email Address" value={email}
								              className="col-lg-6"/>
								<ProfileField ref="phone" name="phone" placeholder="Company Phone Number" value={phone}
								              className="col-lg-6"/>
								<ProfileField ref="address" name="address" placeholder="Company Address" value={address}
								              className="col-lg-12"/>
							</div>
							<div className="row sec-group">
								<ProfileField ref="country" name="country" placeholder="Country" value={country} renderer={v => v.name}
								              className="col-lg-12"/>
								<ProfileField ref="zone" name="zone" placeholder="Province" value={zone} renderer={v => v.name}
								              className="col-lg-6"/>
								<ProfileField ref="city" name="city" placeholder="City" value={city} renderer={v => v.name}
								              className="col-lg-6"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
}

export default CompanyProfile;
//402, 328