import React from "react";
import {observer} from 'mobx-react';
import {observable, when} from 'mobx';
import {Clickable} from 'components/inputs';
import {FeedbackDialog, PrivacyPolicyDialog, SupportDialog, TermsAndConditionsDialog} from 'components/dialogs';

import style from "./Footer.lazy.css";

@observer
class Footer extends React.Component {

    @observable
    state = {socialLinksDataLoaded: false, siteInfoDataLoaded: false};

    constructor() {
        super();

        this.onSocialLinksDataLoaded = this.onSocialLinksDataLoaded.bind(this);
        this.onSiteInfoDataLoaded = this.onSiteInfoDataLoaded.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
//		app.onFooterDidMount(this);

        when(() => this.state.socialLinksDataLoaded && this.state.siteInfoDataLoaded, () => {
//			app.onFooterDidComplete(this);
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    onSocialLinksDataLoaded() {
        this.state.socialLinksDataLoaded = true;
    }

    onSiteInfoDataLoaded() {
        this.state.siteInfoDataLoaded = true;
    }

    onClick(e, elem) {
        const {action} = elem.props;
        if (action === 'news') {
//            this.refs.supportDialog.open();
        } else if (action === 'faqs') {
//            this.refs.supportDialog.open();
        } else if (action === 'privacy-policy') {
            this.refs.privacyPolicyDialog.open();
        } else if (action === 'acceptable-use-policy') {
//            this.refs.supportDialog.open();
        } else if (action === 'ts-and-cs') {
            this.refs.termsAndConditionsDialog.open();
        }
        //
        else if (action === 'support') {
            this.refs.supportDialog.open();
        } else if (action === 'feedback') {
            this.refs.feedbackDialog.open();
        }
        //
        else if (action === 'contact-us') {
//            this.refs.feedbackDialog.open();
        } else if (action === 'who-we-are') {
//            this.refs.feedbackDialog.open();
        } else if (action === 'what-we-do') {
//            this.refs.feedbackDialog.open();
        } else if (action === 'why-choose-us') {
//            this.refs.feedbackDialog.open();
        } else if (action === 'meet-our-team') {
//            this.refs.feedbackDialog.open();
        }
    }

    render() {
        return <>
            <footer>
                <div id="footer-links">
                    <div className="row clearfix">
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div>
                                <h3>INFO</h3>
                                <aside>
                                    <Clickable action="news" onClick={this.onClick}>
                                        <a className="footer-page-link">News</a>
                                    </Clickable>
                                    {/*<Clickable action="faqs" onClick={this.onClick}>
                                    <a className="footer-page-link">FAQs</a>
                                </Clickable>*/}
                                    <Clickable action="privacy-policy" onClick={this.onClick}>
                                        <a className="footer-page-link">Privacy Policy</a>
                                    </Clickable>
                                    <Clickable action="acceptable-use-policy" onClick={this.onClick}>
                                        <a className="footer-page-link">Acceptable Use Policy</a>
                                    </Clickable>
                                    <Clickable action="ts-and-cs" onClick={this.onClick}>
                                        <a className="footer-page-link">Terms and Conditions</a>
                                    </Clickable>
                                </aside>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div>
                                <h3>SUPPORT</h3>
                                <aside>
                                    <Clickable action="support" onClick={this.onClick}>
                                        <a className="footer-page-link">Support</a>
                                    </Clickable>
                                    <Clickable action="feedback" onClick={this.onClick}>
                                        <a className="footer-page-link">Feedback</a>
                                    </Clickable>
                                </aside>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div>
                                <h3>ABOUT</h3>
                                <aside>
                                    {/*<Clickable action="contact-us" onClick={this.onClick}>
                                    <a className="footer-page-link">Contact Us</a>
                                </Clickable>*/}
                                    <Clickable action="who-we-are" onClick={this.onClick}>
                                        <a className="footer-page-link" data-section=".about_us-who-we-are">Who We
                                            Are</a>
                                    </Clickable>
                                    <Clickable action="what-we-do" onClick={this.onClick}>
                                        <a className="footer-page-link" data-section=".about_us-what-we-do">What We
                                            Do</a>
                                    </Clickable>
                                    <Clickable action="why-choose-us" onClick={this.onClick}>
                                        <a className="footer-page-link" data-section=".about_us-why-choose-us">Why
                                            Choose Us</a>
                                    </Clickable>
                                    <Clickable action="meet-our-team" onClick={this.onClick}>
                                        <a className="footer-page-link" data-section=".about_us-meet-our-team">Meet Our
                                            Team</a>
                                    </Clickable>
                                </aside>
                            </div>
                        </div>
                    </div>
                    <SiteInfo onDataLoaded={this.onSiteInfoDataLoaded}/>

                    <PrivacyPolicyDialog ref="privacyPolicyDialog"/>
                    <TermsAndConditionsDialog ref="termsAndConditionsDialog"/>

                    <SupportDialog ref="supportDialog"/>
                    <FeedbackDialog ref="feedbackDialog"/>

                </div>
            </footer>
        </>;
    }
}

@observer
class FooterSocialLinks extends React.Component {

    @observable
    data = [];

    componentWillMount() {
        /*WWConfig.emit("getSocialLinks", data => {
         this.data.pushAll(data);
         });*/
    }

    componentDidMount() {
        when(() => !this.data.isEmpty(), () => {
            this.props.onDataLoaded();
        });
    }

    render() {
        return (!this.data.isEmpty() && <aside>
            {this.data.map(v => <a target="_blank" href={"https://" + v.link}>
                <i className={"fa fa-" + v.ico}/>{v.title}
            </a>)}
        </aside>);
    }
}

@observer
class SiteInfo extends React.Component {

    @observable
    state = {date: null};

    componentWillMount() {
        /*WWConfig.emit("getSiteInfo", data => {
         extendObservable(this.state, data);
         });*/
    }

    componentDidMount() {
        when(() => !!this.state.date, () => {
            this.props.onDataLoaded();
        });
    }

    render() {
        return <div className="site-info">
            &copy;{this.state.date || new Date().getFullYear()} SHEQIntel. All Rights Reserved. <span
            className="site-info-line">|</span> <span className="site-info-powered-by">Powered By <a target="_blank"
                                                                                                     href="https://sheqsolve.com">SHEQIntel</a></span>
        </div>;
    }
}

export default Footer;
