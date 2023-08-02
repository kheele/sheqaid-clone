import React from "react";
import PropTypes from "prop-types";
import EventListener from 'react-event-listener';
import {observer} from 'mobx-react';

@observer
class APage extends React.Component {
    static propTypes = {
        hasBackBtn: PropTypes.bool.isRequired
    }
    static defaultProps = {
        hasBackBtn: true
    }
    classNames = "page-content";

    constructor(props) {
        super(props);

        if (!props.noAnimation) {
            this.classNames += ' scale-up-center';
        }

        this.renderBackBtn = this.renderBackBtn.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
//        !this.props.page && window.app.onPageDidMount(this);
    }

    componentWillUnmount() {
//        !this.props.page && window.app.onPageWillUnmount(this);
    }

    onClose(e) {
        const cb = (e) => {
            e.preventDefault();

            if (this.props.page && this.props.page.close) {
                this.props.page.close(e);
            } else if (window.appBody.hasBackPage) {
                window.appBody.onBack();
            }
        };

        if ((e.type === 'click' || (e.type === 'keydown' && e.which === 8 && !(e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')))) {
            console.log(e.target.localName)
            cb(e);
        }
    }

    renderBackBtn() {
        return this.props.hasBackBtn && <BackButton key="backButton" onClose={this.onClose}>
            <EventListener target={window} onKeyDown={this.onClose} />
        </BackButton>;
    }

}

@observer
class BackButton extends React.Component {

    render() {
        return (this.props.isDialog || window.appBody.hasBackPage) && <i key="backButtonIcon" className="page-back-btn fa fa-arrow-left" onClick={this.props.onClose}>
            {this.props.children}
        </i>;
    }
}

export default APage;
