import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import style from "./grid-view.lazy.css";
import ListLoaderState from './ListLoaderState';

@observer
class GridView extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        renderItem: PropTypes.func.isRequired,
        onLoadList: PropTypes.func,
        list: PropTypes.array
    };

    @observable
    state = {
        list: [],
        dataLoaded: false,
        dataError: false,
        listState: 'action'
    };

    constructor() {
        super();

        this.onLoadList = this.onLoadList.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        this.onLoadList();
    }

    componentWillUnmount() {
        style.unuse();
    }

    @computed
    get list() {
        return this.state.list;
    }

    onLoadList() {
        this.state.dataLoaded = false;
        this.state.dataError = false;

        const {list, onLoadList} = this.props;

        let promise;
        if (!!list && !onLoadList) {
            promise = Promise.resolve(list);
        } else if(onLoadList) {
            promise = onLoadList();
        } else {
            promise = Promise.resolve([]);
        }
        return promise.then(res => {
//            console.log(res);
            this.state.listState = 'initial';
            this.state.list = res;
            this.state.dataError = false;
            this.state.dataLoaded = true;
        }).catch(e => {
            console.log(e)
            this.state.listState = 'initial';
            this.state.dataError = true;
            this.state.dataLoaded = true;
        });
    }

    onLoad(resolve, reject) {
        this.state.listState = 'action';
        this.refs.grid && (this.refs.grid.style.transform = 'translate3d(0px, 0px, 0px)');
        this.onLoadList().then(resolve, reject);
    }

    onChange(evt) {
        this.state.listState = evt.state;
    }

    render() {
        const {className, renderItem, title} = this.props;
        const {dataLoaded, list, dataError} = this.state;
        if (!dataLoaded || list.isEmpty() || dataError) {
            return <ListLoaderState onChange={this.onChange} onLoad={this.onLoad} state={this.state} title={title}/>;
        }
        return <div ref="grid" className={"row grid-view " + (className || "")}>
            {list.map(renderItem)}
        </div>;
    }
}

export default GridView;