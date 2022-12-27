import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable, toJS} from 'mobx';

import {Button} from '../inputs';
import Dialog from '../dialogs/Dialog';
import {Table, TBody, THead, TRow} from './';

import style from "./SelectTable.lazy.css";

@observer
class SelectTable extends React.Component {
    static propTypes = {
        isDialog: PropTypes.bool
    };

    @observable
    state = {
        list: [],
        selectedList: []
    };

    constructor(props) {
        super(props);

        const {list, defaultValue} = this.props;
        if(list) {
            this.state.list = list;
        }
        if (defaultValue) {
            this.state.selectedList = toJS(defaultValue);
            const {onChange, name} = this.props;
            onChange && onChange(toJS(defaultValue), name, this);
        }

        this.onLoadList = this.onLoadList.bind(this);
        this.renderActionsCol = this.renderActionsCol.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onUnSelectAll = this.onUnSelectAll.bind(this);
        this.setSelectedList = this.setSelectedList.bind(this);
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

    onReset(e, btn) {
        this.state.selectedList.clear();
    }

    onSubmit(e, btn) {
        const {isSingleSelect, max = 0} = this.props;
        const {selectedList} = this.state;
        if(selectedList.isEmpty()) {
            infoDialog.open('Please select at least one item');
        } else if(isNumber(max) && max > 0 && selectedList.length > max) {
            infoDialog.open('Please select maximum of ' + max + ' items');
        } else {
//            console.log('selectedList', this.onDone, [...toJS(selectedList)])
            if(isSingleSelect) {
                this.onDone && this.onDone(toJS(selectedList[0]));
            } else {
                this.onDone && this.onDone([...toJS(selectedList)]);
            }
            this.close();
        }
    }
    
    set selectedList(list) {
        if(list) {
            if(!isArray(list) && !isObservableArray(list)) list = [list];
            this.state.selectedList = [...toJS(list)];
            const {readonly, isSingleSelect, onChange, name} = this.props;
            if(!readonly) {
                if(isSingleSelect) {
                    const item = list[0];
                    onChange && onChange(item, name, this);
                } else {
                    const {state: {selectedList}} = this;
                    onChange && onChange(toJS(selectedList), name, this);
                }
            }
        }
    }
    
    setSelectedList(list) {
        this.selectedList = list;
        return this;
    }

    clearSelection() {
        this.state.selectedList.clear();
    }
    
    onSelectAll(e, btn) {
        const {onSelectAll, name, onChange} = this.props;
        if(onSelectAll) {
            this.clearSelection();
            const {selectedList} = this.state;
            selectedList.push(...this.list);
            onChange && onChange(toJS(selectedList), name, this);
        }
    }
    
    onUnSelectAll(e, btn) {
        const {onUnSelectAll, name, onChange} = this.props;
        this.clearSelection();
        const {selectedList} = this.state;
        onChange && onChange(toJS(selectedList), name, this);
    }
    
    @computed get list() {
        return this.state.list;
    }

    set list(value) {
        this.state.list = value;
        console.log(`set list: ${value}`)
    }
    
    @computed get selectedList() {
        return this.state.selectedList;
    }

    open(list) {
        return new Promise((resolve, reject) => {
            this.onDone = resolve;
            this.state.selectedList.clear();
            if (list) {
                this.state.list = list;
            }
            this.refs.dialog.open(this.props.title || "Select Item(s)");
        });
    }

    close() {
        this.onDone = null;
        this.state.selectedList.clear();
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

//                if (res) {
//                    if (res.isEmpty()) {
//                        this.refs.body.resultsEmpty();
//                    }
//                    if (isNew) {
//                        this.state.list = res;
//                    } else {
//                        this.state.list.push(...res);
//                    }
//                    return res.isEmpty();
//                } else {
//                    this.refs.body.resultsEmpty();
//                    return true;
//                }
//                console.log(res)
            });
        }
        return Promise.resolve(this.state.list);
    }

    onClick(e, el) {
        const {readonly, isSingleSelect, onClick, onChange, name} = this.props;
        if (readonly) return;
        const {list, state: {selectedList}} = this;
        const {action, dataIdx} = el.props;
        const item = list[dataIdx];
        if(onClick) {
            onClick && onClick(list, selectedList, item, action, this);
        } else {
            if (action === "add") {
                if(isSingleSelect) {
                    selectedList.clear();
                    selectedList.push(item);
                    onChange && onChange(item, name, this);
                } else {
                    selectedList.push(item);
                    onChange && onChange(toJS(selectedList), name, this);
                }
            } else if (action === "delete") {
                selectedList.remove(item);
                onChange && onChange(toJS(selectedList), name, this);
            }
        }
    }
    
    renderActionsCol(item, n, onClick) {
        const {state: {selectedList}} = this;
        const {isChecked, checkBtnTitle, uncheckBtnTitle, btnClassName, readonly} = this.props;
        return <div className="td fixed-flex padding-l-20 min-w-60">
            <ButtonWrapper n={n} isChecked={isChecked} checkBtnTitle={checkBtnTitle} btnClassName={btnClassName} uncheckBtnTitle={uncheckBtnTitle} state={this.state} item={item} readonly={readonly} selectedList={selectedList} onClick={onClick}/>
        </div>;
    }

    renderItem(n, onClick) {
        const {list, state: {selectedList}} = this;
        const item = list[n];
        const {renderItem, replaceOnlyActions, replaceCols, replaceColsAll, isChecked, onRemove, checkBtnTitle, uncheckBtnTitle, btnClassName} = this.props;
        if(replaceOnlyActions) {
            const tr = renderItem(item, n, onClick, this.renderActionsCol);
            console.log('tr', tr)
            return tr;
        } else {
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                {
                            ((replaceCols || replaceColsAll) && renderItem) ? renderItem(item, n, onClick) : <div className="td">
                                <span>{renderItem ? renderItem(item, n) : (isObject(item) && !!item.desc ? item.desc : item)}</span>
                            </div>
                }
                {!replaceColsAll && <div className="td fixed-flex padding-l-20 min-w-60">
                    <ButtonWrapper n={n} isChecked={isChecked} checkBtnTitle={checkBtnTitle} btnClassName={btnClassName} uncheckBtnTitle={uncheckBtnTitle} state={this.state} item={item} readonly={this.props.readonly} selectedList={selectedList} onClick={onClick}/>
                </div>}
            </TRow>;
        }
    }

    get topButtons() {
        const {onSelectAll, onUnSelectAll} = this.props;
        return <React.Fragment>
            {onSelectAll && <Button ref="selectAll" className="btn btn-primary" onClick={this.onSelectAll}>Select All</Button>}
            {onUnSelectAll && <Button ref="selectAll" className="btn btn-primary" onClick={this.onUnSelectAll}>Clear Selection</Button>}
            <Button ref="cancel" className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button ref="submit" className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }

    render() {
        const {children, desc, className, isDialog, renderTHead} = this.props;
        const tbl = <Table className={"SelectTable " + className} ignoreResize>
            {renderTHead && renderTHead(this.props)}
            {!renderTHead && <THead className="align-left">
                <div className="td">{desc}</div>
                <div className="td fixed-flex padding-l-20 min-w-40"></div>
            </THead>}
            <TBody ref="body" title={desc} renderItem={this.renderItem} onClick={this.onClick} state={this.state} loadOnScrolled onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            {children}
        </Table>;
        if (isDialog) {
            return (<Dialog
                key={this.pageKey + '-profile-dialog'}
                ref="dialog"
                className={'SelectTable-dialog'}
                topButtons={this.topButtons}
                dialog={this}
            >
                {tbl}
            </Dialog>);
        }
        return tbl;
    }
}

@observer
class ButtonWrapper extends React.Component {

    @computed
    get isChecked() {
        const {item, selectedList, isChecked, state} = this.props;
        if(isChecked) return isChecked(item, selectedList);
        return selectedList.contains(item);
    }

    render() {
        const {n, onClick, readonly, btnClassName, checkBtnTitle, uncheckBtnTitle} = this.props;
        let className = "btn btn-primary pull-right w-40";
        if(btnClassName) {
            className += " " + btnClassName;
        }
        return (this.isChecked ?
                <Button dataIdx={n} action="delete" readonly={readonly} className={className} onClick={onClick}>
                    {uncheckBtnTitle ? uncheckBtnTitle : <i className="fa fa-check"/>}
                </Button> :
                <Button dataIdx={n} action="add" readonly={readonly} className={className} onClick={onClick}>
                    {checkBtnTitle ? checkBtnTitle : <i className="fa fa-square"/>}
                </Button>);
    }
}

export default SelectTable;
