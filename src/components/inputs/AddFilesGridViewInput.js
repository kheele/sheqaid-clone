import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {Button, Clickable} from '../inputs';
import {Document} from '../documents';
import GridView from '../lists/GridView';
import {execWhen} from '../../utils/Utils';

import {ViewPhotoDialog} from '../dialogs';

import style from "./AddFilesGridViewInput.lazy.css";

@observer
class AddFilesGridViewInput extends React.Component {

    @observable
    state = {
    };

    constructor() {
        super();

        this.onPreviewPic = this.onPreviewPic.bind(this);
        this.onAddFile = this.onAddFile.bind(this);
        this.onRemoveFile = this.onRemoveFile.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onLoadPlaceholderList = this.onLoadPlaceholderList.bind(this);
    }
    
    componentWillMount() {
        style.use();
    }
    
    componentWillUnmount() {
        style.unuse();
    }
    
    onPreviewPic(evt) {
        this.refs.viewPhotoDialog.open(evt.target.src);
    }

    onAddFile(evt, btn) {
        const {onChange, name} = this.props;
        const {action, idx} = btn.props;
        const {list} = this.refs.gridView;
        if (action === 'self') {
            electronDialog.showOpenDialogDocOrImage().then(file => {
                list[idx] = file;
            });
        } else {
            electronDialog.showOpenDialogDocOrImage().then(file => {
                let added = false;
                for (var n = 0; n < list.length; n++) {
                    if (list[n] === null) {
                        list[n] = file;
                        added = true;
                        break;
                    }
                }
                !added && list.push(file);
            });
        }
        onChange && onChange(toJS(list.filter(val => !!val)), name, this);
    }

    onRemoveFile(e, btn) {
        const {onChange, name} = this.props;
        const {idx} = btn.props;
        const list = this.refs.gridView.list;
        if (list.length === 4) {
            list[idx] = null;
        } else {
            list.removeAt(idx);
        }
        onChange && onChange(toJS(list.filter(val => !!val)), name, this);
    }

    onLoadPlaceholderList() {
        return new Promise((resolve, reject) => {
            execWhen(() => this.refs.gridView).then(({list}) => {
                let {defaultValue, readonly, min} = this.props;
                if(readonly) {
                    resolve(defaultValue || []);
                } else {
                    min = min || 2;
                    if (list.isEmpty()) {
                        const nullList = [];
                        for (var n = 1; n <= min; n++) {
                            nullList.push(null);
                        }
                        resolve(nullList);
                    } else if (list.filter(item => !!item).isEmpty()) {
                        resolve(list);
                    } else {
                        //const 
                        resolve();
                    }
                }
            });
        });
    }
    
    renderItem(item, n) {
        const {readonly, title} = this.props;
        
        const renderPDF = () => {
            let state;
            if(item.path) {
                state = {doc: {previewPath: createPDFPreviewUrl(item.path)}};
            } else if(item.dlUrls) {
                state = {doc: {previewPath: createPDFPreviewUrl(item.dlUrls[0])}};
            }
            return <div className="value file">
                <Document state={state}/>
            </div>;
        };
        const renderDoc = () => {
            if(item.path) {
                return <div className="value file">
                    <iframe src={"https://view.officeapps.live.com/op/embed.aspx?src=" + item.path} width="100%" height="100%" border="none" padding="0"/>
                    <div className="hide-controls"/>
                </div>;
            } else if(item.dlUrls) {
                return <div className="value file">
                    <iframe src={"https://view.officeapps.live.com/op/embed.aspx?src=" + item.dlUrls[0]} width="100%" height="100%" border="none" padding="0"/>
                    <div className="hide-controls"/>
                </div>;
            }
        };
        const renderPic = () => {
            if(item.previewPath) {
                return <img src={item.previewPath} onClick={this.onPreviewPic}/>;
            } else if(item.dlUrls) {
                return <img src={item.dlUrls[0]} onClick={this.onPreviewPic}/>;
            }
        };
        
        return <div key={"item-" + n}>
            {!!item && <div>
                {!FileTypes.isPDF(item) && !FileTypes.isWord(item) && renderPic()}
                {FileTypes.isPDF(item) && renderPDF()}
                {FileTypes.isWord(item) && renderDoc()}
                {!readonly && <Clickable idx={n} onClick={this.onRemoveFile}><i className="fa fa-times"></i></Clickable>}
            </div>}
            {!item && !readonly && <Clickable idx={n} action="self" onClick={this.onAddFile}>
                <div>
                    <h3>{title}</h3>
                    <i className="fa fa-images"></i>
                </div>
            </Clickable>}
        </div>;
    }

    render() {
        const {title, readonly, className} = this.props;
        return <div className={"AddFilesGridViewInput" + (className ? ` ${className}` : "")}>
            <GridView ref="gridView" title={title} renderItem={this.renderItem} onLoadList={this.onLoadPlaceholderList} className="grid-2"/>
            {!readonly && <Button className="btn btn-primary hor-center margin-t-10" onClick={this.onAddFile}>{title}</Button>}
            <ViewPhotoDialog ref="viewPhotoDialog" title={title}/>
        </div>;
    }
}

export default AddFilesGridViewInput;
