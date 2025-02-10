import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {Button} from "components/inputs";

// <editor-fold defaultstate="collapsed" desc="ModuleRenderer">
@observer
class ModuleRenderer extends React.Component {

	@observable
	state = {rendered: true};

	show() {
		this.state.rendered = true;
	}

	hide() {
		this.state.rendered = false;
	}

	componentWillMount() {
		this.state.rendered = !!this.props.rendered;
	}

	getPrice = (price) => {
		if (!price) {
			return 'N/A';
		}
		return price.toCurrency('R');
	};

	render() {
		const {children, item, idx, isInstalled, isInstallable} = this.props;
		if (!this.state.rendered) return null;
		return <div key={item.key} idx={idx}>
			<div className={isInstalled ? 'installed' : undefined}>
				{isInstalled && <i className="fa fa-check"/>}
				{!item.svgIconLeft && <i className={"fa fa-" + item.faIconLeft}/>}
				{item.svgIconLeft && <img src={'img/svg/' + item.svgIconLeft + '.svg'} className="fa fa-"/>}
				<h3>{item.title}</h3>
				<h3 className="price">Price - {this.getPrice(item.price)}</h3>
				<Button className="btn fa fa-info" module={item} onClick={this.onInfo}/>
				{isInstallable && <div className="buttons">
					<Button className="btn btn-primary" module={item} onClick={this.onInstall}>
						{children}
					</Button>
				</div>}
			</div>
		</div>;
	}
}

// </editor-fold>

export default ModuleRenderer;