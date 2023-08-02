// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';

import APage from "../APage";
import FilterWrapper from "../FilterWrapper";

import {calculateRightPos, execWhen, Permissions} from 'utils/Utils';

import {Button} from 'components/inputs';
import {Table, TabledTopPanel, TBody} from 'components/tables';

import Popover from 'components/popovers/Popover';

// </editor-fold>

@observer
class APageList extends APage {
    // <editor-fold defaultstate="collapsed" desc="fields">
    static propTypes = {
        //classes: PropTypes.object.isRequired
    };

    @observable
    state = {
        list: [],
        filtered: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.getDialogByRef = this.getDialogByRef.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onCloseFilter = this.onCloseFilter.bind(this);

        this.onClick = this.onClick.bind(this);
        this.onView = this.onView.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);

        this.onLoadList = this.onLoadList.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        super.componentDidMount();

        autorun(() => {
            if (!!this.refs.body && !this.refs.body.dataLoaded)
                return;
//            this.refs.pageTitle.refs.tabledTopPanel && this.refs.pageTitle.refs.tabledTopPanel.setList(this.state.list);
//			console.log('APageList.componentDidMount.autorun', this.state.list.length)
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onFilter">
    onFilter() {
        this.state.filtered = !this.state.filtered;

        const classList = this.refs.pageTitle.refs.buttonFilterIconDrop.classList;
        classList.toggle('fa-angle-down');
        classList.toggle('fa-angle-up');
        this.refs.filterWrapper.toggle();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCloseFilter">
    onCloseFilter() {
        const classList = this.refs.pageTitle.refs.buttonFilterIconDrop.classList;
        classList.add('fa-angle-down');
        classList.remove('fa-angle-up');
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onClick">
    onClick(e, btn) {
        if (this.props.onClick) {
            this.props.onClick(e, btn);
            return;
        }

        let elem = window.$(e.target);
        if (!elem.hasClass("btn")) {
            elem = elem.closest("button");
        }
        let idx = btn.props.idx;
        const offset = elem.offset();
        const contentNode = this.renderPopoverOptions(idx, e, btn, this.onView, Options);
        const style = {
            left: "auto", 
            right: calculateRightPos(elem[0], false) + 10, 
            top: 'auto', 
            bottom: `clamp(${-offset.top - elem.outerHeight()}px, ${-offset.top - elem.outerHeight()}px, 0px)`,//-offset.top - elem.outerHeight(), 
            width: "auto"
        };
        const {location} = contentNode.props;
        if (location === 'top' || location === 'bottom') {
            style.left = offset.left;
            style.right = "auto";
        }
        if (location === 'top') {
            style.top = 'auto';
            style.bottom = `clamp(10px, ${-offset.top + 10}px, 0px)`;
        } else if (location === 'bottom') {
            style.top = `clamp(10px, ${offset.top + elem.outerHeight() + 10}px, 0px)`;
            style.bottom = 'auto';
        }
        this.refs.popover.settings({
            style, contentNode
        }).open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onView">
    onView(e, elem) {
        const profileDialog = this.getDialogByRef("profileDialog");
        if (profileDialog) {
            let {idx} = elem.props;
            if (!('idx' in elem.props))
                idx = parseInt(elem._reactInternals.key.replace("item-view-", ""));

            const {promise} = this.props.page.props;
            profileDialog.open(this.list[idx]).then(() => {
                promise && promise.resolve && promise.resolve();
            }).catch(e => {
                promise && promise.reject && promise.reject(e);
                throw e;
            });
        } else {
            infoDialog.open(<p className='action-prohibited'>The action is prohibited</p>);
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getDialogByRef">
    getDialogByRef(ref) {
        if(!ref) return null;
        
        const {props: {page, listPage}} = this;
        let d;
        if (page && page.refs && page.refs[ref]) {
            d = page.refs[ref];
        } else if (page && page.props && page.props.listPage) {
            d = page.props.listPage.refs[ref];
        } else if (listPage) {
            d = listPage.refs[ref];
        }
        return d;
    }
    // </editor-fold>

    @computed get filtered() {
        return this.state.filtered;
    }

    // <editor-fold defaultstate="collapsed" desc="listGroup, list">
    @computed
    get listGroup() {
        const {onListByGroup} = this.props;
        if(onListByGroup) {
            return onListByGroup(this.list);
        }
    }
    
    @computed
    get list() {
        return this.state.list;
    }
    
    set list(list) {
        this.state.list = list;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    async onLoadList(args = {}) {
        const {lastItem, filterData, isNew = true} = args;

        const body = await execWhen(() => this.refs.body);

        if(this.filtered) {
            body.state.dataLoaded = false;
        }

        let {list, onLoadList} = this.props;
        let promise;
        if (onLoadList) {
            promise = onLoadList({page: this, lastItem, filterData, filtered: this.filtered, isNew});
        } else if (list) {
            promise = Promise.resolve(list);
        } else {
            promise = Promise.resolve();
        }
        return promise.then(async res => {
            //			console.log("dataStale", this.refs.body.dataStale, res)
            if (body.dataStale)
                return;

            const {onLoaded} = this.props;

            if (res) {
                if (isNew) {
                    this.list = res;
                } else {
                    this.list.push(...res);
                }

                if (res.isEmpty()) {
                    if(this.list.isEmpty()) {
                        body.resultsEmpty();
                    }

                    onLoaded && onLoaded();
                } else {
                    onLoaded && onLoaded(this.list);
                }

                if(this.filtered) {
                    body.state.dataLoaded = true;
                }

                return res.isEmpty();
            } else {
                body.resultsEmpty();
                onLoaded && onLoaded();
                return true;
            }
        });
    }
    // </editor-fold>
    
    load() {
        const {body} = this.refs;
        this.state.list = [];
        body.onLoadList();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            path, 
            filterNodeFloat, 
            renderFilterNode, 
            page, pageId, hideTitleBar, pageTitle, pageTitleSingular, listCountTopTitle, createBtnTitle, renderTHead, renderItem, getTBodyProps, loadOnScrolled = true, renderDefaultLeftButtons, renderLeftButtons, renderRightButtons, children} = this.props;
        const tbodyProps = getTBodyProps ? getTBodyProps() : {};
        if(this.listGroup) {
            tbodyProps.list = this.listGroup;
        } else {
            tbodyProps.state = this.state;
        }
        let classNames = this.classNames;
        if(page && page.classNames && isString(page.classNames)) {
            classNames += " " + page.classNames;
        }
        return (<div key={pageId} id={pageId} className={"no-page-scrollbars " + classNames}>
            <PageTitle 
                ref="pageTitle"
                hideTitleBar={hideTitleBar}
                pageTitle={pageTitle} 
                pageTitleSingular={pageTitleSingular} 
                createBtnTitle={createBtnTitle} 
                hasCreateBtn={this.hasCreateBtn}
                listCountTopTitle={listCountTopTitle} 
                renderFilterNode={renderFilterNode}
                renderDefaultLeftButtons={renderDefaultLeftButtons}
                renderLeftButtons={renderLeftButtons} 
                renderRightButtons={renderRightButtons}
                renderBackBtn={this.renderBackBtn}
                onFilter={this.onFilter}
                onNew={this.onNew}
                />
            <FilterWrapper
                ref="filterWrapper"
                key="filterWrapper"
                page={this}
                filterNodeFloat={filterNodeFloat}
                renderFilterNode={renderFilterNode}
                onClose={this.onCloseFilter}
            />
            <Table key="table" ref="table">
                {isFunction(renderTHead) ? renderTHead() : renderTHead}
                <TBody 
                    ref="body" 
                    title={pageTitle || (page && page.title)} 
                    renderItem={renderItem} 
                    onClick={this.onClick} 
                    onLoadList={this.onLoadList}
                    loadOnScrolled={loadOnScrolled}
                    {...tbodyProps}
                    />
            </Table>
            {filterNodeFloat && <div className="filter-float"/>}  
            <Popover key="popover" ref="popover"/>
            <Children path={path} list={this.list}>{children}</Children>        
        </div>);
    }
    // </editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="Options">
@observer
class Options extends React.Component {

    constructor(props) {
        super(props);

        this.renderChild = this.renderChild.bind(this);
    }
    
    renderChild(child) {
        const {idx, permissionModKey, permissionOtherKey, override = false, readonly} = this.props;
        
        if (!child)
            return undefined;
        
        const {props, props: {action: _action}} = child;
        let action = _action ? _action.toLowerCase() : "";
        
        const isWritable = () => {
            if(!action) return false;
            return action === 'writable' || action === 'edit' || action === 'remove';
        };
        
        const isSavable = () => {
            if(!action) return false;
            return action === 'download' || action === 'save-pdf' || action === 'print' || action === 'share';
        };
        
        if(action) {
            if(isWritable() || isSavable()) {
                const {isEmployee, isContractorViewVisited} = storage.is;
                if(readonly && (action === 'edit' || action === 'remove')) return undefined;
                if(isEmployee) return undefined;
                if(!override && isContractorViewVisited) return undefined;
            }
        }

        switch(action) {
            case "view": {
                //console.log(action, ' : ',  (permissions && Permissions.disallowView(permissions)))
                if(permissionModKey) {
                    if(Permissions.disallowViewMod(permissionModKey)) return undefined;
                }
                if(permissionOtherKey) {
                    if(Permissions.disallowViewOther(permissionOtherKey)) return undefined;
                }
                break;
            }
            case "edit": {
                //console.log(action, ' : ',  (readonly || (permissions && Permissions.disallowEdit(permissions))))
                if(readonly) return undefined;

                if(permissionModKey) {
                    if(Permissions.disallowEditMod(permissionModKey)) return undefined;
                }
                if(permissionOtherKey) {
                    if(Permissions.disallowEditOther(permissionOtherKey)) return undefined;
                }
                break;
            }
            case "remove": {
                //console.log(action, ' : ',  (readonly || (permissions && Permissions.disallowRemove(permissions))))
                if(readonly) return undefined;

                if(permissionModKey) {
                    if(Permissions.disallowRemoveMod(permissionModKey)) return undefined;
                }
                if(permissionOtherKey) {
                    if(Permissions.disallowRemoveOther(permissionOtherKey)) return undefined;
                }
                break;
            }
            case "share": {
                if(permissionModKey) {
                    if(Permissions.disallowShareMod(permissionModKey)) return undefined;
                }
                if(permissionOtherKey) {
                    if(Permissions.disallowShareOther(permissionOtherKey)) return undefined;
                }
                break;
            }
            case "download":
            case "save-pdf":
            case "print": {
                if(permissionModKey) {
                    if(Permissions.disallowPrintMod(permissionModKey)) return undefined;
                }
                if(permissionOtherKey) {
                    if(Permissions.disallowPrintOther(permissionOtherKey)) return undefined;
                }
                break;
            }
        }
        
//        alert(action + ' : ' + 'here')        
        
        return React.cloneElement(child, {idx, ...props});
    }
    
    render() {
        const {location, children} = this.props;
        return <div key="popover" location={location || ""}>
            {React.Children.map(children, this.renderChild)}
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Children">
@observer
class Children extends React.Component {

    constructor(props) {
        super(props);

        this.renderChild = this.renderChild.bind(this);
    }
    
    renderChild(child) {
        const {path, list} = this.props;
        
        if (!child)
            return undefined;
        if (child.ref === 'newDialog' || child.ref === 'editDialog') {
            return React.cloneElement(child, {path});
        } else if (child.ref === 'profileDialog') {
            return React.cloneElement(child, {
                path,
                onRemoved: item => {
                    setTimeout(() => {
                        list.removeIf((val, _idx) => val.id === item.id);
                    });
                }
            });
        }
        return child;
    }
    
    render() {
        const {children} = this.props;
        return <React.Fragment>
            {React.Children.map(children, this.renderChild)}
        </React.Fragment>
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageTitle">
@observer
class PageTitle extends React.Component {

    render() {
        const {hideTitleBar, pageTitle, pageTitleSingular, hasCreateBtn, createBtnTitle, listCountTopTitle, renderFilterNode, renderLeftButtons, renderRightButtons, renderDefaultLeftButtons, renderBackBtn, onFilter, onNew} = this.props;
        return !hideTitleBar && <div className="page-title">
            {renderBackBtn()}
            {pageTitle && <h3 key="title">{pageTitle}</h3>}
            <TabledTopPanel key="tabledTopPanel" ref="tabledTopPanel" titleSinglar={pageTitleSingular} titlePlural={listCountTopTitle ? listCountTopTitle : pageTitle ? pageTitle.toLowerCase() : ""}>
                {renderRightButtons && renderRightButtons()}
                {hasCreateBtn() && <Button ref="buttonCreate" key="buttonCreate" shouldRender={false} className="btn btn-primary pull-right top-btn-nav__create" onClick={onNew}>
                    <i key="buttonCreateIcon" className="fa fa-plus icon-left"/>{createBtnTitle || 'Create'}
                </Button>}
                {renderFilterNode && <Button key="buttonFilter" className="btn btn-primary pull-right top-btn-nav__filter" onClick={onFilter}>
                    <i key="buttonFilterIcon" className="fa fa-search icon-left"/>Filter<i ref="buttonFilterIconDrop" key="buttonFilterIconDrop" className="fa fa-angle-down icon-right"/>
                </Button>}
                {renderDefaultLeftButtons && renderDefaultLeftButtons()}
                {renderLeftButtons && renderLeftButtons()}
            </TabledTopPanel>
            <div className="clearfix"/>
        </div>
    }
}
// </editor-fold>

export default APageList;
