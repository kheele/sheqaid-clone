// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import PropTypes from "prop-types";
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import {CircularProgress} from '@material-ui/core';

import Form from '../../utils/Form';

import {execWhen, isMobile, isWeb} from '../../utils/Utils';
import {ClearableInput, PDFUploadButton} from '../inputs';

import style from "./GDocEditor.lazy.css";

// </editor-fold>

@observer
class GDocEditor extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="fileds">
    static propTypes = {
        state: PropTypes.object.isRequired
    };
    
    @observable state = {
        lists: {
            type: [
                {text: "Type", value: "typed", checked: true}, 
                {text: "Word", value: "word", checked: false}, 
                {text: "PDF", value: "pdf", checked: false}
            ]
        },
        loadStatus: 'LOADING',
        doc: null,
        type: "typed"
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
        this.onLoadError = this.onLoadError.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeFileType = this.onChangeFileType.bind(this);
        
        this.onChangeFile = this.onChangeFile.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        if(this.props.notcreate) return;
        this.state.loadStatus = 'LOADING';
        
        const {onChange, name, item, state, readonly, doc_old} = this.props;
        const createSrc = () => {           
            if(app.isConnected) {
                clearTimeout(this.timeoutErr);
                clearTimeout(this.timeoutTry);
                this.state.loadStatus = 'LOADED';
                execWhen(() => this.refs.frameWrapper).then(frameWrapper_ref => {
                    onChange && onChange(this.state.doc, name, this);
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
        if (item || (state && state.new_doc_id)) {
            if(item) {
                this.state.doc = item.data.doc;
            } else if(state) {
                this.state.doc = state.new_doc_id;
            }
            createSrc();
        } else if(!readonly) {
            const {title} = state;
            const load = () => {
                this.state.loadStatus = 'LOADING';

                neonBinding.events.emit("default/docs/doc/new", title).then(res => {
                    const {id} = res.data;
                    this.state.doc = state.new_doc_id = id;
                    createSrc();
                    // indexedStorage.orphanedUploadedDocs.createOrUpdate({id});
                }).catch(err => {
                    this.timeoutErr = setTimeout(() => {
                        this.state.loadStatus = 'ERROR';
                        this.timeoutTry = setTimeout(load, 10000);
                    }, 2000);
                });
            };
            load();
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
        clearTimeout(this.timeoutErr);
        clearTimeout(this.timeoutTry);
        const {frameWrapper} = this.refs;
        if(frameWrapper && frameWrapper.refs.iframe){
            const {iframe} = frameWrapper.refs;
            iframe.src = "about:blank";
            $(iframe).remove();
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="get src">
    get src() {
        const {readonly, doc_old} = this.props;
        const {doc} = this.state; 
        if(readonly) {
            if(doc_old) {
                const url = doc_old && doc_old.dlUrls  && doc_old.dlUrls[0];
                if(url) {
                    return `https://docs.google.com/gview?url=${url}&embedded=true`;
                }
            }
            return `https://docs.google.com/document/d/${doc}/preview`;
        } else {
            return `https://docs.google.com/document/d/${doc}/edit?usp=drivesdk`;
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="refresh">
    refresh() {
        execWhen(() => this.refs.frameWrapper && this.refs.frameWrapper.refs.iframe).then(() => {
            const {frameWrapper} = this.refs;
            const {iframe} = frameWrapper.refs;
            iframe.src = this.src;
            console.log('refresh', iframe.src)
            iframe.addEventListener('did-stop-loading', this.onLoadSuccess);
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onLoadSuccess">
    onLoadSuccess() {
        const {frameWrapper} = this.refs;
        const {iframe} = frameWrapper.refs;
        if(isWeb()) {
            if(isMobile()) {
                
            } else {
//            alert('onLoadSuccess web')
//            const contents = $(iframe).contents();
//            console.log('contents', contents.html())
            
            //meta [content=title];
            }
        } else {
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
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onLoadError">
    onLoadError() {
        const {frameWrapper} = this.refs;
        if(frameWrapper){
            const {iframe} = frameWrapper.refs;
            iframe.src = this.src;
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeFile">
    onChangeFile(val, name, el) {
        const {type} = this.state;
        console.log('onChangeFile', type, val)
        if(val) {
            if(type === "word" || type === "pdf") {
                progressDialog.open("Uploading File...");
                const {item, state} = this.props;
                let doc;
                if(item) {
                    doc = item.data.doc;
                } else if(state) {
                    doc = state.new_doc_id;
                }
                console.log('onChangeFile', doc)
                neonBinding.events.emit("default/docs/doc/update-upload", doc, val.path, type).then(res => {
                    console.log(type, res);
                    if(res) {
                        const {dlUrls, gcsUri} = res;
    //                    this.refs.iframe.style.display = "block";
//                        this.state.doc = state.new_doc_id = id;
    //                    this.refresh();
                    }
                    progressDialog.close();
                });
            }
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeFileType">
    onChangeFileType(val, name, el) {
        this.state.type = val || "typed";
        if(this.state.type === "typed") {
            this.refresh();
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="removeDoc">
    removeDoc() {
        let {state = {}, readonly} = this.props;
        if (readonly || !state.new_doc_id)
            return Promise.resolve();

        progressDialog.open("Removing unsaved document");
        return neonBinding.events.emit("default/docs/doc/remove", state.new_doc_id).then(res => {
            // indexedStorage.orphanedUploadedDocs.remove(state.new_doc_id);
            console.log(this.constructor.name, 'removed doc', state.new_doc_id)
            progressDialog.close();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeTitle">
    onChangeTitle(val, name, el) {
        if (Form.hasVal(val)) {
            let {item, state = {}, onChangeTitle, readonly} = this.props;
            let doc;
            if(item) {
                doc = item.data.doc;
            } else if(state) {
                doc = state.new_doc_id;
            }

            neonBinding.events.emit("default/docs/doc/edit-title", doc, val).then(res => {
    //                    state.new_doc_id = res.data.id;
                onChangeTitle && onChangeTitle(val, name, el);
            });
        } else {
            
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {//this.state.loadStatus = 'LOADING';
        let {item, state = {}, onChangeTitle, readonly, defaultValue} = this.props;
        const title = item ? item.data.title : state.title;
//        if(!defaultValue) {
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
//        }
        console.log('defaultValue', defaultValue)

        return <React.Fragment>
            {!readonly && onChangeTitle && <ClearableInput name="title" type="textarea" placeholder="Document Title" defaultValue={title} required className="col-lg-4 hor-center form-control" onChange={this.onChangeTitle}/>}
            
            {!readonly && <ClearableInput 
                ref="type" 
                name="type" 
                type="radio" 
                required 
                className="form-control col-lg-4 hor-center" 
                onChange={this.onChangeFileType}
                values={this.state.lists.type}/>}
                
            {!readonly && <hr className="margin-t-10 margin-b-20"/>}
            
            <PDFUploadButtonWrapper state={this.state} readonly={readonly} onChange={this.onChangeFile}/>
            <FrameWrapper ref='frameWrapper' state={this.state} onLoadSuccess={this.onLoadSuccess} onLoadError={this.onLoadError}/>
        </React.Fragment>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="PDFUploadButtonWrapper">
@observer
class PDFUploadButtonWrapper extends React.Component {
    render() {
        let {state: {type}, readonly, onChange} = this.props;
        if(type === "typed") return null;
        type = type.toTitleCase();
        return <PDFUploadButton key={new Date().getTime()} name="doc" buttonTitle={"Upload Document(" + type + ")"} readonly={readonly} showOnlyIcon className="col-lg-4 hor-center" onChange={onChange}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="FrameWrapper">
@observer
class FrameWrapper extends React.Component {
    componentDidMount() {
        if(isWeb()) {
            let {state: {type}, onLoadSuccess, onLoadError} = this.props;
            execWhen(() => this.refs.iframe).then(iframe => {
                iframe.onload = (evt) => {
                    const {type} = evt;
                    if(type === 'load') {
                        onLoadSuccess && onLoadSuccess();
                    } else {
                        onLoadError && onLoadError();
                    }
//                    console.log('FrameWrapper', type)
                };
            });
        }
    }
    
    render() {
        let {state: {type}, onLoadSuccess, onLoadError} = this.props;
        if(type !== "typed") return null;
        if(isMobile()) {
            return <div key={new Date().getTime()} className="GDocEditor h-50">
                <h4 className="fixed-center margin-0">
                    Document Editing is currently not supported in <b>Mobile Browsers</b>
                </h4>
            </div>;
        }
        
        const props = {
            ref: "iframe",
            key: "FrameWrapper",
            disablewebsecurity: "true",
            webpreferences: "allowRunningInsecureContent",
            sandbox: "allow-scripts allow-same-origin",
            width: "100%",
            height: "100%", 
            frameBorder: "0", 
            padding: "0"
        };
        return <div key={new Date().getTime()} className="GDocEditor">
            {isWeb() && <iframe 
                {...props}
            />}
            {!isWeb() && <webview 
                {...props}
                onSuccess={onLoadSuccess}
                onError={onLoadError}
            />}
        </div>;
    }
}
// </editor-fold>

export default GDocEditor;
