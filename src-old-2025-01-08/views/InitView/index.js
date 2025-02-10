import React from "react";
import {observer} from 'mobx-react';
import {autorun} from 'mobx';

import Popover from 'components/popovers/Popover';
import {execWhen} from 'utils/Utils';
import InitViewUserManual from './InitViewUserManual';
import InitViewAdmin from './InitViewAdmin';
import InitViewClientOrNonConsultant from './InitViewClientOrNonConsultant';
import InitViewContractor from './InitViewContractor';
import InitViewEmployee from './InitViewEmployee';
import InitViewSetupClients from './InitViewSetupClients';
import InitViewNotSelected from './InitViewNotSelected';
import Footer from '../Footer';

import style from "./InitView.lazy.css";

@observer
class InitView extends React.Component {

	constructor(props) {
		super(props);

		this.showScrollbars = this.showScrollbars.bind(this);
		this.removeScrollbars = this.removeScrollbars.bind(this);

		this.onInfo = this.onInfo.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	componentWillMount() {
		style.use();
	}

	componentDidMount() {
		autorun(() => {
			if (!loggedInApp.isDefaultOverMainView) {
				this.showScrollbars();
			} else {
				this.removeScrollbars();
			}
		});
	}

	componentWillUnmount() {
		style.unuse();
		this.removeScrollbars();
	}

	showScrollbars() {
		const {contentView} = this.refs;
		if (!contentView)
			return;
//        $(contentView).showScrollbars(0.4, "rgb(2,168,168)");
	}

	removeScrollbars() {
		const {contentView} = this.refs;
		if (!contentView)
			return;
//        $(contentView).removeScrollbars();
	}

	onInfo(e, el) {
		const {item: {module}} = el.props;
		let elem = window.$(e.target);
		const offset = elem.offset();
		const style = {left: offset.left, right: "auto", top: "auto", bottom: -offset.top + 10, width: 400};
		this.refs.popover.settings({
			className: 'ModuleInfoPopover',
			style,
			contentNode: <div>{module.desc}</div>
		}).open();
	}

	async onClick(e, el) {
		let {item, item: {module}} = el.props;
		module = module || item;

		let allow;
		if (storage.is.isEmployee || storage.is.isContractor) {
			allow = true;
		} else {
			console.log('InitView.module', el.props.item, module)
			try {
				const {permissions_module_list} = storage.loggedUser.user.data;
				console.log('InitView.permissions_module_list', permissions_module_list.slice())
				allow = !permissions_module_list || permissions_module_list.find(({module: {key: __key}}) => __key === module.key);
			} catch (e) {
				console.error('InitView', e);
			}
		}

		if (allow) {
			execWhen(() => !!loggedInApp && !!loggedInApp.refs && !!loggedInApp.refs.mainView).then(() => {
				loggedInApp.refs.mainView.navigate(module);
			});
		}
	}

	render() {
		const {loggedInApp, mainView} = window;
		if(loggedInApp.isUserManualView) {
			return <div ref="rootView" key="initView" className="InitView">
				<div ref="contentView" className="view-content nice-scrollbars">
					<InitViewUserManual/>
					<Footer/>
				</div>
			</div>;
		}

		if((loggedInApp.defaultView && loggedInApp.defaultView.isOpen) || (mainView && mainView.isOpen)) {
			return null;
		}

		const {is: {isContractorView, isContractorViewIncContractorPack}} = storage;
		if (isContractorView && !isContractorViewIncContractorPack) return null;

		return <div ref="rootView" key="initView" className="InitView">
			<div ref="contentView" className="view-content nice-scrollbars">
				<InitViewAdmin onInfo={this.onInfo} onClick={this.onClick}/>
				<InitViewSetupClients/>
				<InitViewClientOrNonConsultant onInfo={this.onInfo} onClick={this.onClick}/>
				<InitViewContractor onInfo={this.onInfo} onClick={this.onClick}/>
				<InitViewEmployee onInfo={this.onInfo} onClick={this.onClick}/>
				<InitViewNotSelected/>
				<Footer/>
			</div>
			<Popover key="popover" ref="popover"/>
		</div>;
	}

}

export default InitView;