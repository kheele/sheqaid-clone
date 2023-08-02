import {observer} from "mobx-react";
import React from "react";
import {Button} from "components/inputs";

@observer
class ItemRenderer extends React.Component {
	render() {
		const {
			idx,
			allow,
			onInfo,
			onClick,
			item,
		} = this.props;
		let {module} = item;
		const {borderColor, key, svgIconLeft, faIconLeft, title} = module || item;
		return <div key={key} className={`col-lg-2 col-md-2 col-sm-3 col-xs-4${!allow ? " readonly" : ""}`} idx={idx}>
			<div style={{borderColor}}>
				{!svgIconLeft && <i className={"fa fa-" + faIconLeft}/>}
				{svgIconLeft && <img src={'img/svg/' + svgIconLeft + '.svg'} className="fa fa-"/>}
				<h3>{title}</h3>
				<div className="buttons">
					<Button className="btn btn-primary" item={item} onClick={onInfo}>Info</Button>
					{allow && <Button className="btn btn-primary" item={item} onClick={onClick}>Open</Button>}
				</div>
				{!allow && <p className="access-hint">No Access</p>}
			</div>
		</div>;
	}
}

export default ItemRenderer;