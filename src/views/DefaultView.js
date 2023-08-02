import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {autorun, observable} from 'mobx';

import {execWhen} from 'utils/Utils';
import Popover from 'components/popovers/Popover';
import {NavigateTop} from 'components';
import Body from './Body';

@observer
class DefaultView extends React.Component {

    @observable
    isOpen = false;
    bodyData;

    constructor() {
        super();

        window.loggedInApp.defaultView = this;

        this.navigate = this.navigate.bind(this);
        this.onOpenPage = this.onOpenPage.bind(this);
    }

    componentDidMount() {
        autorun(() => {
            if (!this.isOpen)
                return;

            execWhen(() => {
                try {
                    this.self = ReactDOM.findDOMNode(this);
                    return this.self;
                } catch(ex) {
                    return false;
                }
            }).then(self => {
//                window.$(self.querySelector(".nav")).showScrollbars(0.8, "rgb(2,168,168)");
                self.querySelector(".main-content").addEventListener("scroll", (e) => {
                    let pos = e.target.scrollTop;
                    if (pos > 60) {
                        this.refs.navigateTop.show();
                    } else {
                        this.refs.navigateTop.hide();
                    }
                }, false);

                if (document.querySelector('.header-wide')) {
                    self.classList.add('DefaultView-wide');
                }
            });
        });
    }

    navigate(module, args) {
        this.isOpen = true;
        return new Promise((resolve, reject) => {
            execWhen(() => this.refs.body).then(body => {
                body.navigate(module, args).then(resolve).catch(reject);
            });
        });
    }

    onOpenPage(e, elem) {
        const onOpen = () => {
            this.isOpen = true;
            return new Promise((resolve, reject) => {
                execWhen(() => this.refs.navigateTop).then(navigateTop => {
                    navigateTop.onClick(e);
                    execWhen(() => this.refs.body).then(body => {
                        body.onOpenPage(e, elem).then(resolve).catch(reject);
                    });
                });
            });
        };
        const {reauth} = elem.props;
        if(reauth) {
            return loggedInApp.openAuth().then(() => {
                return onOpen();
            });
        } else {
            return onOpen();
        }
    }

    onClose() {
        this.isOpen = false;
    }

    render() {
        return this.isOpen && <div ref="rootView" key="DefaultView" className="DefaultView">
            <div className="main-content nice-scrollbars">
                <Body isDefaultView={true} ref="body"/>
                <NavigateTop ref="navigateTop"/>
            </div>
            {this.props.children}
            <Popover key="popover" ref="popover"/>
        </div>;
    }
}

export default DefaultView;
