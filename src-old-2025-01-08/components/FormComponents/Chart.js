import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {CanvasJSChart} from "../stats/canvasjs.react";

// <editor-fold defaultstate="collapsed" desc="Chart">
@observer
class Chart extends React.Component {

	@observable state = {
		show: false,
		options: null
	};

	constructor(props) {
		super(props);

		this.onRef = this.onRef.bind(this);
		this.update = this.update.bind(this);
	}

	componentDidMount() {
		if (this.props.onRef) {
			this.props.onRef(this);
		}
		this.state.options = this.props.options;
		this.state.show = true;
	}

	componentWillUpdate() {
		this.state.options = this.props.options;
	}

	onRef(ref) {
		this.chart = ref;
	}

	options(options) {
		this.state.show = false;
		setTimeout(() => {
			this.state.options = options;
			this.state.show = true;
		});
		return this;
	}

	update(ms) {
		this.state.show = false;
		setTimeout(() => {
			this.state.show = true;
		}, ms || 0);
	}

	render() {
		const {show, options} = this.state;
		if (!show || !options) return null;
//
		return (<CanvasJSChart key={new Date().getTime()} options={options} onRef={this.onRef}/>);
	}
}

// </editor-fold>

export default Chart;