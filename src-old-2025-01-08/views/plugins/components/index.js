import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from 'components/inputs';
import {insertErrorReporting} from "mutations/create";

@observer
class AsyncTD extends React.Component {

    render() {
        const {title, className = ""} = this.props;
        return <div className={"td " + className}>
            <h6 className="xs-shown font-size-13">{title}</h6>
            <Val key={new Date().getTime()} {...this.props}/>
        </div>;
    }
}

@observer
class AsyncSpan extends React.Component {

    render() {
        return <span><Val key={new Date().getTime()} {...this.props}/></span>;
    }
}

@observer
class Val extends React.Component {

    @observable
    state = {
        val: null,
        loaded: false
    };

    async componentDidMount() {
        let {onSetVal, path, id, defaultValue} = this.props;
        if ('defaultValue' in this.props) {
            if (defaultValue instanceof Promise) {
                this.state.val = await defaultValue;
            } else {
                this.state.val = defaultValue;
            }
            this.state.loaded = true;
            return;
        }
        if (this.state.val) {
            onSetVal && onSetVal(this.state.val);
            this.state.loaded = true;
        } else if (path) {
            if (path !== 'users') {
                path = 'plugin_sheq_assist/' + path;
            }
            this.state.val = await window.neonBinding.events.emit(path + '/find_by_id', id);
            onSetVal && onSetVal(this.state.val);
            this.state.loaded = true;
        }
    }

    render() {
        const {renderer, defaultText, defaultValue} = this.props;
        const rendererImpl = (val) => {
            try {
                return renderer(val);
            } catch (err) {
                console.error(err);
                const onReport = (evt, btn) => {
                    btn.text("Reporting...").disabled();
                    insertErrorReporting({error: err, errorInfo: err}).finally(() => {
                        btn.text("Report Problem").enabled();
                    });
                };
                return <div className="td error text-center">
                    This column content contains errors.
                    <Button className="btn btn-primary" text="Report Problem" onClick={onReport}/>
                </div>;
            }
        };

        const {val, loaded} = this.state;
        if (!loaded)
            return "Loading...";
        if (!val)
            return defaultText || "N/A";
        return rendererImpl(val);
    }
}

export {AsyncTD, AsyncSpan};
