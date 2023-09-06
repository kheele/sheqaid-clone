import React from "react";
import {observer} from 'mobx-react';
import {ProfileField, SelectClientInput, SelectProjectInput, SelectSiteInput} from "./index";
import {Row} from "../FormComponents";
import {computed} from "mobx";

@observer
class RowOrgs extends React.Component {

	@computed get child() {
		const {children} = this.props;
		if (!children) return null;

		const {onFormOpen, onFormBack, onFormNext, onFormSave, onChange} = this.props;

		const {isContractor, hasProjects} = storage.is;

		const props = {
			onFormOpen,
			onFormNext,
			onFormSave,
		};

		if (onChange) {
			props.onChange = onChange;
		}
		if (hasProjects || isContractor) {
			props.onFormBack = onFormBack;
		}

		return React.Children.map(children, (child, index) => {
			if (!child) return null;
			return React.cloneElement(child, props);
		}).filter(child => !!child);
	}

	render() {
		const {
			onFormOpen, onFormNext, onFormSave, onChange,
			readonly, title, idx = 0, active = true,
			client, project, site, showAll
		} = this.props;

		const {isContractor, isConsultant, hasProjects} = storage.is;

		if (!hasProjects && !isContractor) {
			return this.child;
		}
		return <>
			<Row
				rendered
				active={active}
				idx={idx}
				title={`${title || (isConsultant ? 'Company / ' : '')}Project / Site`}
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormSave={onFormSave}
			>
				{readonly && <>
					{(isContractor || isConsultant) &&
						<ProfileField
							name="client"
							value={client}
							renderer={v => v.name || v.data.name}
							placeholder="Company"
							className="col-lg-12"
						/>}
					<ProfileField
						name="project"
						value={project}
						renderer={v => v.name || v.data.name}
						placeholder="Project"
						className="col-lg-12"
					/>
					<ProfileField
						name="site"
						value={site}
						renderer={v => v.name || v.data.name}
						placeholder="Site"
						className="col-lg-12"
					/>
				</>}
				{!readonly && <>
					{(isContractor || isConsultant) &&
						<SelectClientInput
							name="client"
							placeholder="Company..."
							defaultValue={client}
							showAll={showAll}
							className="col-lg-12 form-control"
							onChange={onChange}
						/>}
					<SelectProjectInput
						name="project"
						placeholder="Project..."
						defaultValue={project}
						showAll={showAll}
						className="col-lg-12 form-control"
						onChange={onChange}
					/>
					<SelectSiteInput
						name="site"
						placeholder="Site..."
						defaultValue={site}
						showAll={showAll}
						className="col-lg-12 form-control"
						onChange={onChange}
					/>
				</>}
			</Row>
			{this.child}
		</>;
	}
}

export default RowOrgs;