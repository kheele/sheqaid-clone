import React from "react";
import {CircularProgress} from '@material-ui/core';

import style from "./PrintPreview.lazy.css";

class PrintPreview extends React.Component {
	static propTypes = {
	};
	
	constructor(props) {
		super(props);
		this.viewerRef = React.createRef();
		
		this.loadStart = this.loadStart.bind(this);
		this.loadStop = this.loadStop.bind(this);
	}
	
	componentWillMount() {
		style.use();
	}
	
    componentDidMount() {
		const webview = document.createElement('webview');
		
		const comp = <React.Fragment>{this.props.children}</React.Fragment>;
		let code = "function() {\n";
        code += "\t(" + comp.toString() + "\t)();\n";
        code += "}";
		
		const blob = new Blob(["<script>(" + code + ")();</script>"], {type: 'text/html'});
		const url = URL.createObjectURL(blob);
		webview.src = url;
		
		const element = this.viewerRef.current;
		//webview.addEventListener('did-start-loading', loadStart, false);
		//webview.addEventListener('did-stop-loading', loadStop, false);
		$(element).html(webview);
	}
	
	componentWillUnmount() {
		style.unuse();
		//const element = this.viewerRef.current;
		//const webview = element.querySelector('webview');
		//webview.removeEventListener('did-start-loading', this.loadStart);
		//webview.removeEventListener('did-stop-loading', this.loadStop);
	}
	
	loadStart() {
		//const element = this.viewerRef.current;
		//const loading = element.querySelector('.results-loading');
		//loading.style.display = 'block';
	}
	
	loadStop() {
		//const element = this.viewerRef.current;
		//const loading = element.querySelector('.results-loading');
		//loading.style.display = 'none';
	}
	
	render() {
		return <div ref={this.viewerRef} id='PrintPreview'>
			<div className="results-loading">
				<CircularProgress/>
				Loading PDF Document...
			</div>
      </div>;
	}
}

export default PrintPreview;
