import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {Button} from 'components/inputs';

import style from "./FilterWrapper.lazy.css";

@observer
class FilterWrapper extends React.Component {

    @observable
    state = {
        open: false,
        listCopy: []
    };

    constructor() {
        super();

        this.toggle = this.toggle.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onSearch = this.onSearch.bind(this);

        this.form = new Form();
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    async onSearch() {
        // let {page: {refs: {body}, props: {onLoadList}}} = this;
        let {page: {refs: {body}, onLoadList}} = this;
        body.state.dataLoaded = false;

        const classList = this.isOpen ? ReactDOM.findDOMNode(this).classList : null;
        if (this.form.hasData) {
            const {formData: filterData} = this.form;
            classList && classList.add('filter-wrapper-large');

            if (onLoadList) {
                onLoadList({filterData, isNew: true});
            } else {
                if (this.page.state.list.isEmpty()) {
                    body.resultsEmpty();
                }
                body.state.dataLoaded = true;
            }
        } else {
            body.onLoadList();
            classList && classList.remove('filter-wrapper-large');
        }
    }

    @computed get isOpen() {
        return this.state.open;
    }

    get page() {
        return this.props.page;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.state.listCopy = toJS(this.page.list);
        return new Promise((resolve, reject) => {
            this.state.open = true;
            resolve();
        });
    }

    close() {
        this.form.reset();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.props.onClose();
                this.state.open = false;
                this.page.list = this.state.listCopy;
                resolve();
            }, 200);
        });
    }

    render() {
        const {filterNodeFloat, renderFilterNode} = this.props;
        if (!renderFilterNode) return null;
        return this.isOpen &&
            <div className={"row filter-wrapper" + (!!filterNodeFloat ? ' filter-wrapper-float' : '')}>
                <label className="label">Filter By:</label>
                <i className="fa fa-close" onClick={this.close}/>
                {renderFilterNode(this.form.onChange)}
                <Button className="btn btn-primary pull-right search-btn" onClick={this.onSearch}>Search</Button>
                <Button className="btn btn-primary pull-right close-btn" onClick={this.close}>Close</Button>
            </div>;
    }
}

export default FilterWrapper;
