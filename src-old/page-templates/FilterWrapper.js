import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

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

    onSearch() {
        let {page, page: {refs: {body}, props: {path, onLoadList, onLoadListFilter}}} = this;
        body.state.dataLoaded = false;

        const classList = this.state.open ? ReactDOM.findDOMNode(this).classList : null;
        if (this.form.hasData) {
            const {formData: filterData} = this.form;
            classList && classList.add('filter-wrapper-large');

            let promise;
            let data;
            if(path) {
                data = path.data;
                if (isObject(path)) {
                    path = path.path;
                } else {
                    path += "list";
                }
                
                console.log(path + "/filter", filterData, data)
                promise = window.neonBinding.events.emit(path + "/filter", filterData, data);
            } else if(onLoadList) {
                console.log("onLoadList/filter", filterData, data)
                promise = onLoadList(page).then(res => onLoadListFilter(res, filterData, data));
            }
            promise.then(res => {
                console.log("dataStale", body.dataStale)
                if (body.dataStale)
                    return;

                if (res) {
                    if (res.isEmpty()) {
                        body.resultsEmpty();
                    }
                    this.page.state.list = res;
                    body.state.dataLoaded = true;
                    return res.isEmpty();
                } else {
                    body.resultsEmpty();
                    body.state.dataLoaded = true;
                    return true;
                }
            }).catch(e => {
                console.log(e)
                body.state.dataError = true;
                body.state.dataLoaded = true;
            });
        } else {
            body.onLoadList();
            classList && classList.remove('filter-wrapper-large');
        }
    }

    get page() {
        return this.props.page;
    }

    toggle() {
        if (this.state.open) {
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
        setTimeout(() => {
            this.props.onClose();
            this.state.open = false;
            this.page.list = this.state.listCopy;
        }, 200);
    }

    render() {
        const {filterNodeFloat, renderFilterNode} = this.props;
        if(!renderFilterNode) return null;
        return this.state.open && <div className={"row filter-wrapper" + (!!filterNodeFloat ? ' filter-wrapper-float' : '')}>
            <label className="label">Filter By:</label>
            <i className="fa fa-close" onClick={this.close}/>
            {renderFilterNode(this.form.onChange)}
            <Button className="btn btn-primary pull-right search-btn" onClick={this.onSearch}>Search</Button>
            <Button className="btn btn-primary pull-right close-btn" onClick={this.close}>Close</Button>
        </div>;
    }
}

export default FilterWrapper;
