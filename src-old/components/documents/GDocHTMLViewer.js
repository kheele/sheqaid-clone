import React from "react";
import PropTypes from "prop-types";
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import {CircularProgress} from '@material-ui/core';

import {execWhen} from '../../utils/Utils';

import style from "./GDocEditor.lazy.css";

@observer
class GDocHTMLViewer extends React.Component {
    static propTypes = {
        state: PropTypes.object.isRequired
    };
    
    @observable state = {
        loadStatus: 'LOADING',
        html: null
    };

    constructor(props) {
        super(props);
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        this.state.loadStatus = 'LOADING';
        
        const {html} = this.props;
        const createSrc = () => {           
            if(app.isConnected) {
                clearTimeout(this.timeoutErr);
                clearTimeout(this.timeoutTry);
                this.state.loadStatus = 'LOADED';
                execWhen(() => this.refs.iframe).then(iframe_ref => {
                    setTimeout(() => {
                        this.refresh();
                    }, 3000);
                });
            } else {
                this.timeoutErr = setTimeout(() => {
                    this.state.loadStatus = 'ERROR';
                    this.timeoutTry = setTimeout(() => {
                    this.state.loadStatus = 'LOADING';
                        createSrc();
                    }, 10000);
                }, 2000);
            }
        };
        if (html) {
            this.state.html = html;
            createSrc();
        }
    }

    componentWillUnmount() {
        style.unuse();
        clearTimeout(this.timeoutErr);
        clearTimeout(this.timeoutTry);
        const {iframe} = this.refs;
        if(iframe){
            iframe.src = "about:blank";
            $(iframe).remove();
        }
    }
    
    get src() {
        const {doc} = this.state; 
        const url = 'https://sheqsolve.web.app/app/templates/baseline.html';
        return `https://docs.google.com/gview?url=${url}&embedded=true`;
    }
    
    refresh() {
        const {iframe} = this.refs;
        iframe.src = this.src;
        iframe.addEventListener('did-stop-loading', this.onLoadSuccess);
    }
    
    onLoadSuccess() {
        const {iframe} = this.refs;
        iframe.removeEventListener('did-stop-loading', this.onLoadSuccess);
        iframe.insertCSS(
            '.kix-appview-editor{overflow-x: hidden !important;}\
            #docs-file-menu, #docs-extensions-menu, #docs-help-menu, #printButton,\n\
            .docs-titlebar-buttons, .docs-titlebar-button, #viewModeButton, #docs-toolbar-mode-switcher-separator,\n\
            /*.left-sidebar-container.docs-ui-unprintable,*/\n\
            .docs-butterbar-wrap, .docs-explore-widget {display: none !important;}'
        );
        iframe.executeJavaScript('\n\
            const interval = setInterval(() => {\n\
                const editor = document.querySelector(".kix-appview-editor");\n\
                editor && (editor.scrollLeft = editor.offsetWidth);\n\
                if(editor.scrollLeft > 0) {\n\
                    clearInterval(interval);\n\
                }\n\
            }, 500);\n\
        ');
//        console.log(iframe.contentDocument)
    }
    
    onLoadError() {
        if(this.refs.iframe){
            this.refs.iframe.src = this.src;
        }
    }

    render() {//this.state.loadStatus = 'LOADING';
        let {html} = this.props;
            if(this.state.loadStatus === 'LOADING') {
                return <div className="results-loading text-center margin-t-50">
                    <CircularProgress/>
                    <label className="margin-t-20">Loading document viewer...</label>
                </div>;
            } else if(this.state.loadStatus === 'ERROR') {
                return <div className="results-loading text-center margin-t-50">
                    <CircularProgress/>
                    <label className="margin-t-20">{!app.isConnected ? 'No internet connection.' : 'An error occurred.'}<br />Document viewer couldn't be shown.<br /><br />Trying again in 10 seconds</label>
                </div>;
            }
        return <div key={new Date().getTime()} className="GDocEditor">
            <webview 
                key={new Date().getTime()}
                ref="iframe" 
                disablewebsecurity="true"
                webpreferences="allowRunningInsecureContent"
                sandbox="allow-scripts allow-same-origin" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                padding="0"
                onSuccess={this.onLoadSuccess}
                onError={this.onLoadError}
            />
        </div>;
    }
}

export default GDocHTMLViewer;
