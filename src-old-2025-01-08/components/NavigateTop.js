import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

@observer
class NavigateTop extends React.Component {

    @observable
    isLoaded = false;

    constructor() {
        super();

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    show() {
        this.isLoaded = true;
    }

    hide() {
        this.isLoaded = false;
    }

    onClick() {
        const {delay, getTargetNode} = this.props;
        const target = getTargetNode ? getTargetNode() : ".main-content";
        window.$(target).stop(true, true).animate({scrollTop: 0}, delay || 800, this.hide);
    }

    render() {
        return this.isLoaded && <i id="navigate-top" className="fa fa-angle-double-up" onClick={this.onClick}/>;
    }
}

export default NavigateTop;