import React from "react";
import {CircularProgress} from '@material-ui/core';
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';
import {StyleSheet, View} from '@react-pdf/renderer';

import LazyList from '../../onsenui/LazyList.jsx';

import {ListLoaderState, PullHookState} from '../lists';
import {NavigateTop} from '../';
import {Button} from '../inputs';
import ErrorBoundary from '../ErrorBoundary';

import * as Utils from 'utils/Utils';
import {insertErrorReporting} from "mutations/create";

// Create styles
const styles = StyleSheet.create({
    tbody: {
        display: 'block',
    }
});

@observer
class TBody extends React.Component {

    @observable
    state = {
        listState: 'action',
        sortKey: null,
        showBottomLoader: false,
        noOlderResults: false,
        dataLoaded: false,
        dataError: false,
        dataStale: false
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onLoad = this.onLoad.bind(this);

        this.onScrollListener = this.onScrollListener.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
        this.onLoadBottom = this.onLoadBottom.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    @computed
    get dataStale() {
        return this.state.dataStale;
    }

    @computed
    get dataLoaded() {
        return this.state.dataLoaded;
    }

    @computed get list() {
        let __list = [];
        let {state, listName, list} = this.props;
        if ('list' in this.props && !!list) {
            __list = list;
        }
        if (state) {
            if (listName && listName in state) {
                __list = state[listName];
            } else if (state.list) {
                __list = state.list;
            }
        }

        const {sortKey} = this.state;
        // console.log('table list processing', sortKey)
        if (isString(sortKey)) {
            __list.sortBy(sortKey);
            // console.log('table list processed', sortKey)
        }

        return __list;
    }

    componentDidMount() {
        this.onScrollListener();
        this.onLoadList();

        autorun(() => {
            let {state, sortKey} = this.props;
            if (state) {
                sortKey = state.sortKey || sortKey;
            }

            // console.log('table list will_sort', sortKey)
            if (isString(sortKey)) {
                this.state.dataLoaded = false;
                setTimeout(() => {
                    this.state.sortKey = sortKey;
                    this.state.dataLoaded = true;
                    // console.log('table list sorted', sortKey)
                });
            }
        });
    }

    componentWillUpdate() {
        this.onScrollListener();
    }

    componentWillUnmount() {
        this.state.dataStale = true;
        if (this.refs.tbody && this.state.dataLoaded) {
            this.refs.tbody.removeEventListener('scroll', this.onScroll);
        }
    }

    onScrollListener() {
        const {printPDF} = this.props;
        if (printPDF) return;
        const propsList = this.list || [];
        if (!this.state.dataLoaded || this.state.dataStale) return;
        if (propsList.isEmpty()) {
            const {tbody} = this.refs;
            if (tbody) {
                tbody.removeEventListener('scroll', this.onScroll);
            }
            this.onScroll = null;
        } else {
            if (this.onScroll) return;
            setTimeout(() => {
                if (!this.state.dataStale) {
                    loadBottomData.call(this);
                    const {tbody} = this.refs;
                    tbody && tbody.addEventListener('scroll', this.onScroll, false);
                }
            });
        }
    }

    resultsEmpty() {
        this.state.listState = 'initial';
        this.state.dataError = false;
        this.state.dataLoaded = true;
    }

    onLoadList() {
        const {onLoadList, list} = this.props;

        this.state.dataLoaded = false;
        this.state.dataError = false;

        if (onLoadList) {
            return onLoadList({isNew: true}).then(isEmpty => {
                this.state.listState = 'initial';
                this.state.dataError = false;
                this.state.dataLoaded = true;
            }).catch(e => {
                this.state.listState = 'initial';
                this.state.dataError = true;
                this.state.dataLoaded = true;
                console.log(e)
                throw e;
            });
        } else if (list) {
            this.state.listState = 'initial';
            this.state.dataError = false;
            this.state.dataLoaded = true;
        } else {
            return Promise.reject("this.props.onLoadList no defined");
        }
    }

    onLoadBottom(onLoadComplete) {
        const {loadOnScrolled} = this.props;
        if (!loadOnScrolled) return;
        const lastElem = window.$(this.refs.lazyList._list).children(':last')[0];
        if (Utils.isInView(lastElem)) {
            if (this.props.onLoadList) {
                this.state.showBottomLoader = true;
                setTimeout(() => {
                    const lastItem = this.list.getLastElement();
                    this.props.onLoadList({lastItem, isNew: false}).then(isEmpty => {
                        onLoadComplete();
                        this.state.noOlderResults = isEmpty;
                        this.state.showBottomLoader = false;
                        this.state.dataLoaded = true;
                    }).catch(e => {
                        console.log(e)
                        this.state.dataError = true;
                    });
                }, 2000);
            }
        } else {
            onLoadComplete();
        }
    }

    onLoad(evt) {
        const {listLoaderState, tbody} = this.refs;
        const transform = () => {
            if (this.list.isEmpty() && listLoaderState) {
                listLoaderState.runIfNoResultsNode(node => {
                    node.style.transform = 'translate3d(0px, 0px, 0px)';
                });
            } else if (tbody) {
                tbody.style.transform = 'translate3d(0px, 0px, 0px)';
            }
        };
        transform();
        setTimeout(function () {
            this.onLoadList(true).then(isEmpty => {
                this.refs.navigateTop && this.refs.navigateTop.hide();
                transform();
            });
        }.bind(this), 500);
    }

    onChange(evt) {
        this.state.listState = evt.state;
    }

    renderItem(n) {
        const {widthsState, disableRowHover, renderItem, onClick} = this.props;
        try {
            const item = renderItem(n, onClick);
            if (!item) return null;
            return React.cloneElement(item, {widthsState, disableRowHover});
        } catch (err) {
            console.error(err);
            const onReport = (evt, btn) => {
                btn.text("Reporting...").disabled();
                insertErrorReporting({error: err, errorInfo: err}).finally(() => {
                    btn.text("Report Problem").enabled();
                });
            };
            return <div className="tr error">
                This row content contains errors.
                <Button className="btn btn-primary" text="Report Problem" onClick={onReport}/>
            </div>;
        }
    }

    renderChildren() {
        return null;/*React.Children.map(this.refs.lazyList.props.children, (child, index) => {
            const {state: {printPDF}} = this;
            return React.cloneElement(child, {printPDF, tdPos: "body"});
        });*/
    }

    render() {
        const {title = "items", className, disablePullToRefresh, children, listName, printPDF} = this.props;
        if (printPDF) {
            return <View style={styles.tbody}>
                {this.renderChildren()}
            </View>;
        }
        if (!this.state.dataLoaded || this.list.isEmpty() || this.state.dataError) {
            return <ListLoaderState ref="listLoaderState" onChange={this.onChange} onLoad={this.onLoad}
                                    state={this.state} list={this.list} title={title}/>;
        }

        const _className = 'tbody page__content nice-scrollbars' + (className ? (' ' + className) : '');
        return <ErrorBoundary>
            <div ref="tbody" className={_className}>
                {!disablePullToRefresh &&
                    <PullHookState onChange={this.onChange} onLoad={this.onLoad} state={this.state}
                                   listName={listName}/>}
                <LazyList ref="lazyList" length={this.list.length} renderRow={this.renderItem}
                          calculateItemHeight={() => 44}/>
                <PullHookStateBottom state={this.state} message={'No ' + title.toLowerCase() + ' to load'}/>
                <NavigateTop ref="navigateTop" delay={1000} getTargetNode={() => this.refs.tbody}/>
                {children}
                {/*<p className="load-more text-center hor-center padding-15 padding-t-10 w-120">load more</p>*/}
            </div>
        </ErrorBoundary>;
    }
}

@observer
class PullHookStateBottom extends React.Component {

    render() {
        if (this.props.state.showBottomLoader) {
            return <div className={"loading-older-content loading-older-results"}>
                <CircularProgress/>
                <small>Loading...</small>
            </div>;
        } else if (this.props.state.noOlderResults) {
            return <div className={"loading-older-content no-older-results"}>
                {this.props.message}
            </div>;
        }
        return null;
    }
}

function loadBottomData() {
    const {tbody, lazyList} = this.refs;
    if (!tbody || !lazyList) {
        return;
    }
    let jqTbody = window.$(tbody);
    let jqList = window.$(lazyList._list);
    let scrollPos = jqTbody.scrollTop();
    let firstElem, lastElem, isTopLoading = true, isBottomLoading = true;
    this.onScroll = (evt) => {
        const scroll = jqTbody.scrollTop();
        if (scroll > scrollPos) {
            lastElem = lastElem || getLastElement(jqList);
            if (Utils.isInView(lastElem)) {
                lastElem = getLastElement(jqList);
                if (isBottomLoading) {
                    isBottomLoading = false;
                    this.onLoadBottom(() => {
                        isBottomLoading = true;
                    });
                }
            } else {
                //this.state.showBottomLoader = false;
            }
        }
        scrollPos = scroll;

        if (scrollPos > 60) {
            this.refs.navigateTop.show();
        } else {
            this.refs.navigateTop.hide();
        }
    };
}

function getLastElement(parentView) {
    return parentView.children(':last')[0];
}

TBody.propTypes = {};

export default TBody;
