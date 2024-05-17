// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {calculateRightPos, execWhen, isWeb} from 'utils/Utils';
import {Button} from 'components/inputs';
import {SupportDialog} from 'components/dialogs'

import SelectedPlugin from './SelectedPlugin';
import SelectedItems from './SelectedItems';
import SelectedContractorItems from './SelectedContractorItems';
import ProfileButton from './ProfileButton';
import NotificationsButton from './NotificationsButton';
import {
	AuditTrailBtn,
	CalendarBtn,
	ChatsBtn,
	DashboardBtn,
	EmployeesBtn,
	PluginsBtn,
	QuestionsBtn,
	SelectOrgsBtn,
	SelectShortcutsBtn,
	UsersBtn
} from './Buttons';

import style from "./Header.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Header">
@observer
class Header extends React.Component {

	@observable
	state = {};

	constructor() {
		super();

		this.onClickHeader = this.onClickHeader.bind(this);
		this.onPopoverMessages = this.onPopoverMessages.bind(this);
		this.onViewSupport = this.onViewSupport.bind(this);
	}

	componentWillMount() {
		style.use();
	}

	componentDidMount() {
		//window.app.onHeaderDidMount(this);

		//when(() => this.state.contactsDataLoaded && this.state.socialLinksDataLoaded, () => {
		//window.app.onHeaderDidComplete(this);
		//});
	}

	componentWillUnmount() {
		style.unuse();
	}

	onClickHeader(evt) {
		const jq = $(evt.target);
		if (jq.hasClass('nav-toggle-menu') || jq.closest('.nav-toggle-menu').length === 1) {
			console.log('onClickHeader', mainView)
			//mainView && mainView.onCloseMobileMenu();
		}
	}

	onViewSupport() {
		this.refs.supportDialog.open();
	}

	onPopoverMessages(e) {
		popover.settings({
			style: {left: "auto", right: calculateRightPos(this.refs.messages.getDOMNode()), top: 60},
			contentNode: <div key="messages">
				<p>1</p>
				<h3>2</h3>
			</div>
		}).open();
	}

	render() {
		return (<header ref="header" className="scale-up-center" onClick={this.onClickHeader}>
			<BackButton/>
			<MenuButton/>
			<HomeButton/>
			<UserManualButton/>
			<SelectedPlugin/>
			<SelectedItems
				onPopoverNotifications={(e) => this.refs.multipleBtnActions.refs.notificationsButton.onPopoverNotifications(e)}/>
			<SelectedContractorItems/>
			<div className="right-actions profile-btn-actions">
				<ProfileButton/>
			</div>
			<MultipleBtnActions ref="multipleBtnActions"/>
			<PersonsButtons />
			<SupportDialog ref="supportDialog"/>
		</header>);
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PersonsButtons">
@observer
class PersonsButtons extends React.Component {

	render() {
		if (loggedInApp.isUserManualView)
			return null;
		
		return <div className="right-actions people-btn-actions">
			<UsersBtn/>
			<EmployeesBtn/>
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="MultipleBtnActions">
@observer
class MultipleBtnActions extends React.Component {

	constructor() {
		super();

		this.onRestart = this.onRestart.bind(this);
	}

	onRestart() {
		confirmDialog.open(<React.Fragment>
			<p>This action restarts the system.</p>
			<p>Are you sure you want to restart?</p>
		</React.Fragment>).then(res => {
			if (res === 1) {
				app.restart();
			}
		});
	}

	render() {
		if(loggedInApp.isUserManualView) 
            return null;

		if (isAdminApp) {
			if (isWeb()) {
				return null;
			} else {
				return <div className="right-actions multiple-btn-actions">
					<Button ref="restart" className="fa fa-refresh btn" hoverText="Restart Application" onClick={this.onRestart}/>
				</div>;
			}
		}
		return <div className="right-actions multiple-btn-actions">
			<SelectShortcutsBtn/>
			<PluginsBtn/>
			<QuestionsBtn/>
			<SelectOrgsBtn/>
			<CalendarBtn/>
			<DashboardBtn/>
			<ChatsBtn/>
			<NotificationsButton ref="notificationsButton"/>
			<AuditTrailBtn/>
			{!isWeb() &&
				<Button ref="restart" className="fa fa-refresh btn" hoverText="Restart Application" onClick={this.onRestart}/>}
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="MenuButton">
@observer
class MenuButton extends React.Component {

	@observable isOpen = false;

	componentDidMount() {
		execWhen(() => window.mainDrawer).then(mainDrawer => {
			this.isOpen = true;
		});
	}

	onClick() {
		mainDrawer.isOpen = !mainDrawer.isOpen;
	}

	render() {
		if (!this.isOpen) return null;

		return <Button className={`nav-toggle nav-toggle-menu${mainDrawer.isOpen ? ' fa fa-times' : ''}`}
		               onClick={this.onClick}>
			<div>
				<span></span>
				<svg viewBox="0 0 24 24">
					<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
				</svg>
			</div>
		</Button>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="HomeButton">
@observer
class HomeButton extends React.Component {

	onClick() {
		loggedInApp.isUserManualView = false;
		defaultView.isOpen = false;
		mainView.isOpen = false;
	}

	render() {
		const {isContractorView, isContractorViewIncContractorPack} = storage.is;
		if (isContractorView && !isContractorViewIncContractorPack)
			return null;
		return <Button className="nav-toggle nav-toggle-home" onClick={this.onClick}>
			<div>
				<i key="backButtonIcon" className="page-back-btn fa fa-home"/>
				<span></span>
			</div>
		</Button>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="BackButton">
@observer
class BackButton extends React.Component {

	onBack(e, el) {
		loggedInApp.isUserManualView = false;
		defaultView.isOpen = false;
	}

	render() {
		if (!loggedInApp.isUserManualView && !loggedInApp.isDefaultOverMainView)
			return null;
		const {isContractorView, isContractorViewIncContractorPack} = storage.is;
		if (isContractorView && !isContractorViewIncContractorPack)
			return null;

		return <Button className="back-btn" onClick={this.onBack}>
			<i key="backButtonIcon" className="page-back-btn fa fa-arrow-left"/>
		</Button>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="UserManualButton">
@observer
class UserManualButton extends React.Component {

	constructor() {
		super();

		this.onClick = this.onClick.bind(this);
	}

	onClick(evt) {
		defaultView.isOpen = false;
		mainView.isOpen = false;
		loggedInApp.isUserManualView = true;
	}

	render() {
		if (loggedInApp.isUserManualView)
			return null;
		// const {isContractorView, isContractorViewIncContractorPack} = storage.is;
		// if (isContractorView && !isContractorViewIncContractorPack)
		// 	return null;

		return <Button className="user-manual-btn" hoverText="User Manual" hoverTextLeft onClick={this.onClick}>
			<i className="fa fa-question"/>
		</Button>;
	}
}

// </editor-fold>

export default Header;
