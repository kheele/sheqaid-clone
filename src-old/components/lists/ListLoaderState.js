import React from "react";
import {findDOMNode} from "react-dom";
import {CircularProgress} from '@material-ui/core';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

import style from "./list-loader-state.lazy.css";

import PullHookState from './PullHookState';

@observer
class ListLoaderState extends React.Component {

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    getDOMNode() {
        return findDOMNode(this);
    }

    runIfNoResultsNode(cb) {
        const node = this.getDOMNode();
        node && node.classList.contains('results-none') && cb(node);
    }
    
    @computed get list(){
        const {state, listName, list} = this.props;
        if('list' in this.props && !!list) {
            return list;
        }
        if(state) {
            if(listName && listName in state) {
                return state[listName];
            } else if(state.list) {
                return state.list;
            }
        }
        return [];
    }

    render() {
        let {title, onLoad, onChange, state, state: {dataLoaded, dataError}} = this.props;
        let list = this.list;

        if (!isBoolean(dataLoaded)) {
            if (isBoolean(this.props.dataLoaded)) {
                dataLoaded = this.props.dataLoaded;
            } else {
                throw new Error('dataLoaded property is not provided');
            }
        }
        if (!isBoolean(dataError)) {
            if (isBoolean(this.props.dataError)) {
                dataError = this.props.dataError;
            } else {
                throw new Error('dataError property is not provided');
            }
        }

        if (!dataLoaded) {
            return <div className="results-loading">
                <CircularProgress/>
                Loading {!!title ? title.toLowerCase() : ""}...
            </div>;
        } else if ((!!list && list.isEmpty()) || dataError) {
            const {DataError, NoResults} = this;
            return <div className="results-none">
                <PullHookState onChange={onChange} onLoad={onLoad} state={state}>
                    <DataError dataError={dataError} title={title}/>
                    <NoResults dataError={dataError} title={title} list={list}/>
                </PullHookState>
            </div>;
        }
        return null;
    }
    
    DataError({dataError, title}) {
        return !!dataError && <React.Fragment>
            <span>An error occurred while loading {title}. <br /> Pull to try again</span>
        </React.Fragment>;
    }
    
    NoResults({dataError, title, list}) {
        return (!dataError && !!list && list.isEmpty()) && <React.Fragment>
            <span>{title} are currently not available. <br /> Pull to refresh</span>
        </React.Fragment>;
    }
}

ListLoaderState.propTypes = {

};

export default ListLoaderState;
