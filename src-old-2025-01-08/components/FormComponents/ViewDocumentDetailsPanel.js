import {observer} from "mobx-react";
import React from "react";
import {Clickable, ProfileField, ProfilePic} from "components/inputs";
import {isObservableArray} from "mobx";
import {Dates} from "utils/Dates";
import {NavButtons} from "./Forms";

// <editor-fold defaultstate="collapsed" desc="ViewDocumentDetailsPanel">
@observer
class ViewDocumentDetailsPanel extends React.Component {

	constructor(props) {
		super(props);

		this.renderProfilePic = this.renderProfilePic.bind(this);
	}

	renderProfilePic() {
		const {data: {company = {}}} = this.props.item;
		const {id, data} = company;
		if (data && data.profile_pic) {
			return <img src={data.profile_pic.dlUrls[0]} width="100%" height="100%"/>;
		} else {
			return <ProfilePic readonly profilePic="clients" id={id} fixedCenter/>;
		}
	}

	render() {
		const {
			props: {
				onFormBack, onFormOpen, item: {
					id, data: {
						created_at,
						type,
						desc,
						internal_or_external,
						responsible_department,
						responsible_person,
						expiry,
						company,
						title,
						doc_num,
						doc
					}
				},
				title: secTitle, idx, showOnlyFile
			}
		} = this;

		const lastDoc = isArray(doc) || isObservableArray(doc) ? doc.getLastElement() : doc;

		console.log('document lastDoc', lastDoc)

		let companyName;
		if (company) {
			const {name, data: _data} = company;
			companyName = name || _data.name;
		}

		return <div className={"row " + (!onFormOpen && "active-always")}>
			<label>
				{secTitle || "View Document Details"}
				{onFormOpen && <Clickable idx={idx || 3} onClick={onFormOpen}><i
					className="fa fa-angle-down icon-right pull-right"/></Clickable>}
			</label>
			{!showOnlyFile && <div className="row sec-group">
				<ProfileField title="Responsible Department" type="select" value={responsible_department}
				              renderer={val => val.name} className="col-lg-4"/>
				<ProfileField title="Responsible Person" type="select" value={responsible_person}
				              renderer={val => val.fname + ' ' + val.lname} className="col-lg-4"/>
				<ProfileField title="Expiry Date" type="date" value={expiry} className="col-lg-4"/>
			</div>}
			{!showOnlyFile && <div className="row sec-group">
				<ProfileField title="Document Description" type="textarea" value={desc} className="col-lg-12"/>
			</div>}
			<div className="ViewHeader row sec-group padding-r-0">
				{type !== 'Upload' && <div className="row flex margin-0 margin-t-10 margin-b-20 row-header">
					<div className="row margin-0 fixed-flex min-w-200">
						{this.renderProfilePic()}
					</div>
					<div className="row row-header-name margin-0">
						<div className="row margin-0 h-half padding-10">
							<h3 className="fixed-center margin-0">{companyName || 'N/A'}</h3>
						</div>
						<div className="row margin-0 h-half padding-10">
							<h4 className="fixed-center margin-0">{title}</h4>
						</div>
					</div>
					<div className="row row-header-numbers margin-0 fixed-flex min-w-400">
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Document No.</h5>
							<h6 className="text-center margin-0">{doc_num}</h6>
						</div>
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Revision No.</h5>
							<h6 className="text-center margin-0">{lastDoc.doc_rev_num}</h6>
						</div>
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Revision Date</h5>
							<h6 className="text-center margin-0">{Dates.formatDate(lastDoc.doc_rev_date)}</h6>
						</div>
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Page No.</h5>
							<h6 className="text-center margin-0"></h6>
						</div>
					</div>
				</div>}
				{type === 'Upload' &&
					<ProfileField name="doc" value={lastDoc.doc} type="file" className="col-lg-12 h-full"/>}
				{type === 'Type' &&
					<div className="col-lg-12 document-preview" dangerouslySetInnerHTML={{__html: lastDoc.doc}}/>}
			</div>
			{onFormBack && <NavButtons idx={idx || 3} onBack={onFormBack}/>}
		</div>;
	}
}

// </editor-fold>

export default ViewDocumentDetailsPanel;