import React from "react";
import {CircularProgress} from '@material-ui/core';

import style from "./PDFViewer.lazy.css";

class PDFViewer extends React.Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.viewerRef = React.createRef();
        this.backend = new props.backend();

        this.loadStart = this.loadStart.bind(this);
        this.loadStop = this.loadStop.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        const {previewPath} = this.props;
        const run = (previewPath) => {
            const element = this.viewerRef.current;
            this.backend.init(previewPath, element, this.loadStart, this.loadStop);
        };
        if (previewPath instanceof Promise) {
            previewPath.then(run);
        } else {
            run(previewPath);
        }
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
        return <div ref={this.viewerRef} id='PDFViewer'>
            <div className="results-loading">
                <CircularProgress/>
                Loading PDF Document...
            </div>
        </div>;
    }
}

export default PDFViewer;
