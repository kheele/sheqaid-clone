import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ShowFile, ShowOnlyIcon} from './UploadComponents';

import style from "./UploadButton.lazy.css";

@observer
class UploadButton extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };
    
    @observable
    state = {rendered: true};

    constructor() {
        super();
    }
    
    componentWillMount() {
        style.use();
        
        let {rendered} = this.props;
        if ("rendered" in this.props) {
            this.state.rendered = rendered;
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    hide() {
        this.state.rendered = false;
        return this;
    }

    show() {
        this.state.rendered = true;
        return this;
    }
    
    render() {
        if(!this.state.rendered) {
            return null;
        }
//        let {props: {readonly, className, buttonTitle, showOnlyIcon}, fileIcon, isPDF, isWord} = this;
        let {props: {name, defaultValue, onChange, readonly, className, buttonTitle, showOnlyIcon}} = this;
//        let {state, state: {base64, docState, path}, props: {className, buttonTitle}} = this;
        return <React.Fragment>
            <ShowOnlyIcon 
                name={name}
                defaultValue={defaultValue}
                onChange={onChange}
                readonly={readonly} 
                className={className} 
                buttonTitle={buttonTitle} 
                showOnlyIcon={showOnlyIcon}
                />
            <ShowFile 
                name={name}
                defaultValue={defaultValue}
                onChange={onChange}
                readonly={readonly} 
                className={className} 
                buttonTitle={buttonTitle} 
                showOnlyIcon={showOnlyIcon} 
                />
        </React.Fragment>;
    }
}

export default UploadButton;
//157