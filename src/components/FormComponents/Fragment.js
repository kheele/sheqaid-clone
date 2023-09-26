import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";

// <editor-fold defaultstate="collapsed" desc="Fragment">
@observer
class Fragment extends React.Component {

	@observable
	state = {rendered: false};

	show() {
		this.state.rendered = true;
	}

	hide() {
		this.state.rendered = false;
	}

	componentWillMount() {
		this.state.rendered = !!this.props.rendered;
	}

	render() {
		const {children} = this.props;
		if (!this.state.rendered) return null;
		return <React.Fragment>
			{children}
		</React.Fragment>;
	}
}

// </editor-fold>

export default Fragment;