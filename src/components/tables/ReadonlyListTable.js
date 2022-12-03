import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button} from '../inputs';
import Dialog from '../dialogs/Dialog';
import {Table, TBody, THead, TRow} from './';

import style from "./ReadonlyListTable.lazy.css";

@observer
class ReadonlyListTable extends React.Component {
    static propTypes = {
        isDialog: PropTypes.bool
    };

    @observable
    state = {
        list: []
    };

    constructor(props) {
        super(props);

        const {list} = this.props;
        if(list) {
            this.state.list = list;
        }

        this.onLoadList = this.onLoadList.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onCancel(e, btn) {
        this.close();
    }
    
    @computed get list() {
        return this.state.list;
    }

    open(list) {
        return new Promise((resolve, reject) => {
            this.onDone = resolve;
            if (list) {
                this.state.list = list;
            }
            this.refs.dialog.open(this.props.title || "Item(s)");
        });
    }

    close() {
        this.onDone = null;
        this.state.list = [];
        this.refs.dialog.close();
    }

    onLoadList(isNew) {
        const {onLoadList} = this.props;
        if (onLoadList) {
            return onLoadList(isNew).then(res => {
                if (this.refs.body.dataStale)
                    return;

                const {onLoaded} = this.props;

                console.log('res', res.length)
                if (res) {
                    if (res.isEmpty()) {
                        this.refs.body.resultsEmpty();
                        onLoaded && onLoaded();
                        if (isNew) {
                            this.state.list = res;
                        } else {
                            this.state.list.push(...res);
                        }
                    } else {
                        if (isNew) {
                            this.state.list = res;
                        } else {
                            this.state.list.push(...res);
                        }
                        onLoaded && onLoaded(this.state.list);
                    }
                    return res.isEmpty();
                } else {
                    this.refs.body.resultsEmpty();
                    onLoaded && onLoaded();
                    return true;
                }
            });
        }
        return Promise.resolve(this.state.list);
    }

    renderItem(n, onClick) {
        const {list} = this;
        const item = list[n];
        const {renderItem, replaceCols, isChecked, onRemove} = this.props;
        
        const getVal = () => {
            if(replaceCols && renderItem) {
                return renderItem(item, n, onClick);
            } else {
                let val;
                if(renderItem) {
                    val = renderItem(item, n);
                } else if(isObject(item) && (item.desc || item.text)) {
                    val = item.desc || item.text;
                } else if(isString(item)){
                    val = item;
                }
                return val && <div className="td padding-l-0 padding-r-0"><span>{val}</span></div>;
            }
        };
        return <TRow key={"item-" + n} className="tr-readonly">
            {getVal()}
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-0"></div>
        </TRow>;
    }

    get topButtons() {
        return <React.Fragment>
            <Button ref="cancel" className="btn btn-primary cancel" onClick={this.onCancel}>Close</Button>
        </React.Fragment>;
    }

    render() {
        const {desc, className, isDialog, renderTHead, loadOnScrolled} = this.props;
        const tbl = <Table className={"ReadonlyListTable " + (className || "")} ignoreResize>
            {renderTHead && renderTHead(this.props)}
            {!renderTHead && <THead className="align-left">
                <div className="td padding-l-0 padding-r-0">{desc}</div>
                <div className="td fixed-flex padding-l-0 padding-r-0 min-w-0"></div>
            </THead>}
            <TBody ref="body" title={desc} renderItem={this.renderItem} onClick={this.onClick} state={this.state} loadOnScrolled={loadOnScrolled} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>;
        if(isDialog) {
            return (<Dialog key={this.pageKey + '-profile-dialog'} ref="dialog" className={'ReadonlyListTable-dialog'} topButtons={this.topButtons}>
                {tbl}
            </Dialog>);
        }
        return tbl;
    }
}

export default ReadonlyListTable;
