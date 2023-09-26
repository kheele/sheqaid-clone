import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import {ShowFile, ShowOnlyIcon} from './UploadComponents';

import style from "./UploadButton.lazy.css";

@observer
class UploadButton extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        showDownload: PropTypes.bool,
        onChange: PropTypes.func.isRequired
    };

    constructor() {
        super();
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    render() {
//        let {props: {readonly, className, buttonTitle, showOnlyIcon}, fileIcon, isPDF, isWord} = this;
        let {props: {name, type, defaultValue, onChange, readonly, showDownload, fileName, className, buttonTitle, showOnlyIcon}} = this;
//        let {state, state: {base64, docState, path}, props: {className, buttonTitle}} = this;
        return <>
            <ShowOnlyIcon 
                name={name}
                type={type}
                defaultValue={defaultValue}
                onChange={onChange}
                readonly={readonly}   
                fileName={fileName}
                showDownload={showDownload}
                className={className} 
                buttonTitle={buttonTitle} 
                showOnlyIcon={showOnlyIcon}
                />
            <ShowFile 
                name={name}
                type={type}
                defaultValue={defaultValue}
                onChange={onChange}
                readonly={readonly}  
                fileName={fileName}
                showDownload={showDownload}
                className={className} 
                buttonTitle={buttonTitle} 
                showOnlyIcon={showOnlyIcon} 
                />
        </>;
    }
}

export default UploadButton;
//216