import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import AProfileDialog from './AProfileDialog';

import style from "./ViewPhotoDialog.lazy.css";

@observer
class ViewPhotoDialog extends AProfileDialog {
    pageKey = "ViewPhotoDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return this.props.title + " Photo";
    }

    @computed get topButtons() {
        return null;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    @observable
    state = {

    };

    constructor() {
        super();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        
        return (<div className="controls-wrapper">
            <div className="controls padding-0">
                <div className="row padding-0">
                    <div className="row sec-group w-full">
                        <img src={this.item} className="hor-center"/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ViewPhotoDialog;
