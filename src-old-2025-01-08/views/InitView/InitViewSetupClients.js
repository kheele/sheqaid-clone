import React from "react";
import {observer} from 'mobx-react';
import MKBox from "components/MK/MKBox";
import {Button} from "components/inputs";
import {execWhen} from "../../utils/UtilsFuns";

@observer
class InitViewSetupClients extends React.Component {
	onCreateSectors() {
		defaultView.navigate('Sectors', 'New').then(item => {
			return true;
		});
	}
	
	onCreateClients() {
		const {login} = storage;
		defaultView.navigate('Clients', 'New').then(item => {
			return login.loginClient(item.id).then(res => {
				return execWhen(() => !!selectedItems && selectedItems.refs.clients).then(ref => {
					ref.select(item);
					return true;
				});
			});
		})
	}
	
	onCreateProjects() {
		const {login} = storage;
		defaultView.navigate('Projects', 'New').then(item => {
			return login.loginProject(item.id).then(res => {
				return execWhen(() => !!selectedItems && selectedItems.refs.projects).then(ref => {
					ref.select(item);
					return true;
				});
			});
		})
	}
	
	onCreateSites() {
		const {login} = storage;
		defaultView.navigate('Sites', 'New').then(item => {
			return login.loginSite(item.id).then(res => {
				return execWhen(() => !!selectedItems && selectedItems.refs.sites).then(ref => {
					ref.select(item);
					return true;
				});
			});
		})
	}
	
	render() {
		const {loggedUser} = storage;
		const {
			selected: {selectedClient},
			is: {hasProjects, isConsultant, isContractorViewIncContractorPack, isEmployee},
			list: {clients, projects}
		} = storage;
		if (isEmployee || isContractorViewIncContractorPack || (!isConsultant && !hasProjects)) return null;
		if (isConsultant) {
			if (clients.isNotEmpty()) return null;
		}
		if (projects.isNotEmpty()) return null;
		
		return <div className="InitViewSetupClients">
			{isConsultant && <MKBox
				className="flex flex-align-center"
				sx={{
					fontSize: '16px',
					background: 'rgba(2, 45, 45, 0.4)',
					padding: '15px 20px',
					marginBottom: '3px',
					color: '#41a0a5',
				}}>
				<p className="margin-0">Currently no clients created.</p>
				<Button text="Create" className="btn btn-primary pull-right fixed-flex" onClick={this.onCreateClients}/>
			</MKBox>}
			{hasProjects && <>
				<MKBox
					className="flex flex-align-center"
					sx={{
						fontSize: '16px',
						background: 'rgba(2, 45, 45, 0.4)',
						padding: '15px 20px',
						marginBottom: '3px',
						color: '#41a0a5',
					}}>
					<p className="margin-0">Currently no projects created.</p>
					<Button text="Create" className="btn btn-primary pull-right fixed-flex" onClick={this.onCreateProjects}/>
				</MKBox>
				<MKBox
					className="flex flex-align-center"
					sx={{
						fontSize: '16px',
						background: 'rgba(2, 45, 45, 0.4)',
						padding: '15px 20px',
						color: '#41a0a5',
					}}>
					<p className="margin-0">Currently no sites created.</p>
					<Button text="Create" className="btn btn-primary pull-right fixed-flex" onClick={this.onCreateSites}/>
				</MKBox>
			</>}
		</div>;
	}
}

export default InitViewSetupClients;
