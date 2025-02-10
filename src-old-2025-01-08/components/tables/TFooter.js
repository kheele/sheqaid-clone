import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

@observer
class TFooter extends React.Component {
    
	@observable state = {
		count: 0
	};
	
    constructor() {
        super();
		
		this.setList = this.setList.bind(this);
    }
	
	componentWillMount() {
	}
	
    componentDidMount() {
    }
	
	setList(list) {
		this.state.count = list.length;
	}
	
	render() {
		const className = 'tfoot' + (this.props.className ? (' ' + this.props.className) : '');
		return (<div className={className}>Displaying {this.state.count} site(s)</div>);
	}
}

TFooter.propTypes = {

};

export default TFooter;
