import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import tabledTopPanel from "./tabled-top-panel.lazy.css";

@observer
class TabledTopPanel extends React.Component {
    	
    constructor() {
        super();
		this.setList = this.setList.bind(this);
    }
	
	componentWillMount() {
		tabledTopPanel.use();
	}
		
	componentWillUnmount() {
		tabledTopPanel.unuse();
	}
	
    setList(list) {
		this.refs.resultsCounter.setList(list);
	}
	
	render() {
		return (<div className="tabled-top-panel pull-right">
			{this.props.children && <div className="buttons pull-right">
				{this.props.children}
			</div>}
			<ResultsCounter key="resultsCounter" ref="resultsCounter" titleSinglar={this.props.titleSinglar} titlePlural={this.props.titlePlural}/>
		</div>);
	}
}

@observer
class ResultsCounter extends React.Component {
    
	@observable state = {
		count: 0
	};
	
    constructor() {
        super();
		this.setList = this.setList.bind(this);
    }
	
	setList(list) {
		this.state.count = list.length;
		console.log('ResultsCounter', this.state.count)
	}
	
	render() {
		return null;/*(<div className="results-counter pull-right">
			Displaying {this.state.count} {this.state.count === 1 ? this.props.titleSinglar : this.props.titlePlural}
		</div>);*/
	}
}

TabledTopPanel.propTypes = {

};

export default TabledTopPanel;
