import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewMatrixDialog.lazy.css";

@observer
class NewMatrixDialog extends ANewDialog {
    pageKey = "Matrix";
    title = "Create Matrix";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {
            type: ["PDF Document", "Word Document"]
        }
    };

    constructor() {
        super();

        this.form = new Form();
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                later
            </div>
        </div>);
    }
}

export default NewMatrixDialog;
