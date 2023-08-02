import React from "react";
import {observer} from 'mobx-react';

import APluginsTab from './APluginsTab.js';
import {Button} from 'components/inputs';

import style from "./PluginsAllTab.lazy.css";

@observer
class PluginsAllTab extends APluginsTab {
    path;
    pageKey = "PluginsAllTab";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onFilter(plugin, list) {
        return list.filter(item => item.status !== 'Upcoming');
    }
    
    renderItem(plugin, item, n) {
        return <div key={item.key} className="col-lg-2" idx={n}>
            <div>
                <i className="fa fa-images"/>
                <h3>{item.title}</h3>
                <div className="buttons">
                    <Button className="btn btn-primary" plugin={plugin} module={item} onClick={this.onClick}>Info</Button>
                </div>
            </div>
        </div>;
    }
}

export default PluginsAllTab;
