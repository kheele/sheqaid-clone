import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import AProfileDialog from './AProfileDialog';

import style from "./UserManualDialog.lazy.css";

import {findByIdManual} from "mutations/findById";

@observer
class UserManualDialog extends AProfileDialog {
    pageKey = "UserManualDialog";

    findById = findByIdManual;

    constructor(props) {
        super(props, style);
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return Controls;
    }

    open(item) {
        this.title = `User Manual (${item.data.name})`;
        return super.open(item);
    }
}

@observer
class Controls extends React.Component {

    @observable state = {};

    constructor() {
        super();
    }

    @computed get item() {
        return this.props.state.item;
    }

    render() {
        const {item} = this;
        if (!item) return null;

        const {
            id,
            data: {
                // site_url
            }
        } = item;

        console.log('item', item)

        //TODO: this hack must be removed once "site_url" loading on database is fixed
        const {
            [id]: site_url,
        } = {
            1: "https://hr-management-ajfqwq2.gamma.site"
        };

        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <div class="hide-brand">USER MANUAL</div>
                        <iframe
                            src={site_url}
                            border="0"
                            width="100%"
                            height="100%"
                        />
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default UserManualDialog;