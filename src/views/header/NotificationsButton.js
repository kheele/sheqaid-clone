// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {Button} from 'components/inputs';
import NavItem from 'components/navs/NavItem';
import Popover from 'components/popovers/Popover';

import notificationStore from './NotificationsStore';

import ProfileCompetencyCertificateDialog from "views/plugins/plugin_hr_management/Competencies/forms/ProfileDialog";
import ProfileContractDialog from "views/plugins/plugin_hr_management/Contracts/forms/ProfileDialog";
import CounselingsDialog from "views/plugins/plugin_hr_management/Counselings/forms/ProfileDialog";
import ProfileMedicalFitnessCertificateDialog from "views/plugins/plugin_hr_management/Medicals/forms/ProfileDialog";
import ProfileWarningDialog from "views/plugins/plugin_hr_management/Warnings/forms/ProfileDialog";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NotificationsButton">
@observer
class NotificationsButton extends React.Component {

	employeesPath = "plugin_sheq_assist/employees/";

	constructor() {
		super();

		this.onGetRef = this.onGetRef.bind(this);
		this.onPopoverNotifications = this.onPopoverNotifications.bind(this);
		this.renderGroup = this.renderGroup.bind(this);
	}

	onGetRef(ref) {
		return this.refs[ref];
	}

	onPopoverNotifications(e) {
		const {isConsultant, hasProjects, isContractor} = storage.is;
		const {list} = notificationStore;
		const {selectedClient} = storage.selected;
		console.log('selectedClient', selectedClient)
		let {name, data} = selectedClient;
		name = name || data.name;
		this.refs.popover.settings({
			style: {left: 'auto', right: 0, top: 0, bottom: 0, width: 350, transform: 'none', position: 'fixed !important'},
			className: 'NotificationsPopover',
			isDialog: true,
			contentNode: <div key="notifications" className="notifications text-center w-full h-full flex-column flex-center">
				{!list.isEmpty() && <React.Fragment>
					{isConsultant && <div className="fixed-flex min-h-55">
						Notifications In
						<b className="hor-center margin-t-0 -margin-b-5">{name}</b>
					</div>}
					{!isConsultant && <div className="fixed-flex min-h-55">
						Notifications
					</div>}
					<div className="w-full h-full-calc-subtract-55">
						{list.map(this.renderGroup)}
					</div>
				</React.Fragment>}
				{list.isEmpty() && isConsultant && <h3 className="text-center margin-10 font-size-16">
					Currently no notifications available in<br/>
					<b className="hor-center margin-t-10">{name}</b>
				</h3>}
				{list.isEmpty() && !isConsultant && <h3 className="text-center margin-10 font-size-16">
					Currently no notifications available
				</h3>}
			</div>
		}).open();
	}

	renderGroup(item, n) {
		return <RenderMainGroup key={n} item={item} idx={n} onGetRef={this.onGetRef}/>;
	}

	render() {
		const {isConsultant, isContractorView, isEmployee} = storage.is;
		const {clients} = storage.list;
		if (isContractorView || isEmployee) return null;
		if (isConsultant && clients.isEmpty()) return null;

		return <Button ref="notifications" className="fa fa-bell btn" title="Notifications" hoverText="Notifications" hoverTextLeft
		               onClick={this.onPopoverNotifications}>
			<Count ref="count"/>
			<Popover ref="popover"/>

			<ProfileCompetencyCertificateDialog ref="competenciesDialog"/>
			<ProfileContractDialog ref="contractsDialog"/>
			<CounselingsDialog ref="counselingsDialog"/>
			<ProfileMedicalFitnessCertificateDialog ref="medicalsDialog"/>
			<ProfileWarningDialog ref="warningsDialog"/>
		</Button>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderMainGroup">
@observer
class RenderMainGroup extends React.Component {

	constructor() {
		super();

		this.onPopover = this.onPopover.bind(this);
		this.renderGroupItem = this.renderGroupItem.bind(this);
		this.renderSubGroup = this.renderSubGroup.bind(this);
	}

	onPopover(e, elem) {
		const {selectedClient} = storage.selected;
		const {name} = selectedClient.data;

		const {count, props: {onGetRef, item: {_group}, idx}} = this;

		const {item} = elem.props;
		let {name_group, list} = item;
		this.selectedNameGroup = name_group;
		const countSubGroup = this.countSubGroup(item);

		setTimeout(() => {
			onGetRef('popover').settings({
				style: {
					left: 'auto',
					right: 355,
					top: 0,
					bottom: 0,
					width: 350,
					transform: 'none',
					position: 'fixed !important'
				},
				className: 'NotificationsPopover',
				isDialog: true,
				contentNode: <div key="notifications"
				                  className="notifications text-center w-full h-full flex-column flex-center">
					<div className="fixed-flex min-h-55">
						Notifications In
						<b className="hor-center margin-t-0 -margin-b-5">{name}</b>
					</div>
					<div className="row margin-l-0 margin-r-0 w-full h-full-calc-subtract-55 text-left">
						<h4 key="h4" className="padding-5 margin-0">
							<span key="span_1" className="counter">{list.length} - {countSubGroup}</span>
							<span key="span_2">{name_group}</span>
						</h4>
						{list.map(this.renderSubGroup)}
					</div>
				</div>
			}).open();
		}, 500);
	}

	renderGroupItem(item, n) {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
//        const {id, data: {_target, _group, name, email_sent, is_read, client, project, site, client_id, project_id, site_id}} = item;
		const {name_group, list} = item;
		console.log('item', Object.keys(item), item)

		const count = notificationStore.filterList(item, selectedClient, selectedProject, selectedSite).filter((
			{
				data: {
					removed,
					is_read
				}
			}
		) => !removed && !is_read).length;

		if (count === 0) {
			return null;
		}

		const title = <p key="p" className="margin-0 flex">
			<span key="span_1" className="counter fixed-flex">{count}</span>
			{name_group} expiry
		</p>;
		return <NavItem key={name_group + n} item={item} onClick={this.onPopover} title={title} className=""/>;
	}

	renderSubGroup(item, n) {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {selectedNameGroup, count} = this;
		console.log(selectedNameGroup, item.id, item.data.client_id, selectedClient.id)
		return <RenderSubGroup key={n} item={item} name_group={selectedNameGroup} idx={n} onGetRef={this.props.onGetRef}/>;
	}

	countSubGroup(item) {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {name_group, list} = item;
		const count = notificationStore.filterList(item, selectedClient, selectedProject, selectedSite).filter((
			{
				data: {
					removed,
					is_read
				}
			}
		) => !removed && !is_read).length;
		return count;
	}

	@computed get count() {
		const {selectedClient, selectedProject, selectedSite} = storage.selected;
		const {item, idx} = this.props;
		const {_group, list} = item;
		return list.map(item => {
			return notificationStore.filterList(item, selectedClient, selectedProject, selectedSite).filter((
				{
					data: {
						removed,
						is_read
					}
				}
			) => !removed && !is_read).length;
		}).reduce((n1, n2) => n1 + n2, 0);
	}

//    @computed get list() {
//        const {selectedClient, selectedProject, selectedSite} = storage.selected;
//        const {item} = this;
//        const {_group, list} = item;
//        return list.map(item => {
//            return notificationStore.filterList(item, selectedClient, selectedProject, selectedSite).
//                filter(({data: {removed, is_read}}) => !removed && !is_read);
//        }).reduce((a1, a2) => [...a1, ...a2], []);
//    }

	render() {
		const {
			count, //list,
			props: {item, idx}
		} = this;
		if (count === 0) {
			return null;
		}

		const {
			_group, list//{name_group, list}
		} = item;

		return <div key={_group} className="row margin-l-0 margin-r-0 w-full text-left">
			<h4 key="h4" className="padding-5 margin-0">
				<span key="span_1" className="counter">{count}</span>
				<span key="span_2">G:{_group}</span>
			</h4>
			{list.map(this.renderGroupItem)}
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderSubGroup">
@observer
class RenderSubGroup extends React.Component {

	constructor() {
		super();

		this.onSelect = this.onSelect.bind(this);
	}

	onSelect(e, elem) {
		const {name_group, item, idx, onGetRef} = this.props;
		const {id, data: {_group, _target: {id: employee_id}}} = item;
		console.log('onSelect', name_group)

		if (_group === 'Employees') {
			progressDialog.open();
			window.neonBinding.events.emit("plugin_sheq_assist/employees/find_by_id", employee_id).then(item => {
				let d;
				switch (name_group) {
					case "Competency Certificates":
						d = onGetRef('competenciesDialog');
						break;
					case "Contracts":
						d = onGetRef('contractsDialog');
						break;
					case "Counselings":
						d = onGetRef('counselingDialog');
						break;
					case "Medical Certificates":
						d = onGetRef('medicalsDialog');
						break;
					case "Warnings":
						d = onGetRef('warningsDialog');
						break;
				}
				return neonBinding.events.emit("notifications/update", id, {is_read: true}).then(res => {
					console.log("emit = notifications/update", id, res)
					item.data.is_read = true;
					d && d/*.extraProp('activeId', id)*/.open(item);
				});
			}).finally(() => {
				setTimeout(() => progressDialog.close());
			});
		}
	}

	render() {
		const {item, idx} = this.props;
		const {id, data: {is_read, _target: {desc: notifMsg}}} = item;
		const dangerouslySetInnerHTML = {__html: notifMsg};
		const title = <p key="p" className={`margin-0 text-left${is_read ? ' is_read' : ''}`}
		                 dangerouslySetInnerHTML={dangerouslySetInnerHTML}/>;
		console.log(item.data.client_id)
		return <NavItem key={idx} item={item} onClick={this.onSelect} title={title} className="RenderSubGroup"/>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Count">
@observer
class Count extends React.Component {

	componentDidMount() {
		notificationStore.load();
	}

	render() {
		const {selectedClient} = storage.selected;
		if (!selectedClient) return null;
		const {count} = notificationStore;
		return count > 0 && <small>{count}</small>;
	}
}

// </editor-fold>

export default NotificationsButton;
//250