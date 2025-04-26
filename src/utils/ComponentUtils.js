import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button} from '../components/inputs';
import {Dates, ExpiryCodes} from './Utils';

// <editor-fold defaultstate="collapsed" desc="RenderDashboardButtonsForExpiryOnly">
@observer
class RenderDashboardButtonsForExpiryOnly extends React.Component {
    
    constructor() {
        super();
    }
    
    render() {
        const {onCount} = this.props;
        return <div className="expiry-btns grid-3 grid-gap-10 padding-10 bg-f5f5f5">
            <RenderDashboardButtonsForExpiryOnlyButton onCount={onCount} expiry_date={null} className="h-60 bg-white color_black" text="No"/>
            <RenderDashboardButtonsForExpiryOnlyButton onCount={onCount} expiry_date={-1} className="h-60 bg-grey" text="Expired"/>
            <RenderDashboardButtonsForExpiryOnlyButton onCount={onCount} expiry_date={1} className="h-60 bg-red" text="1 Month"/>
            <RenderDashboardButtonsForExpiryOnlyButton onCount={onCount} expiry_date={2} className="h-60 bg-orange color_black" text="2 Month"/>
            <RenderDashboardButtonsForExpiryOnlyButton onCount={onCount} expiry_date={3} className="h-60 bg-yellow color_black" text="3 Month"/>
            <RenderDashboardButtonsForExpiryOnlyButton onCount={onCount} expiry_date={4} className="h-60 bg-green" text="+4 Month"/>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderDashboardButtonsForExpiryOnlyButton">
@observer
class RenderDashboardButtonsForExpiryOnlyButton extends React.Component {
    
    render() {
        let {props: {className, onClick, text, onCount, expiry_date}} = this;
        className += ` btn btn-primary grid-1 grid-gap-5 pull-right font-size-12 no-border no-text-shadow`;
        return <Button key={text} expiry_date={expiry_date} className={className} onClick={onClick}>
            {text === 'Expired' && <span>{text}</span>}
            {text !== 'Expired' && <span>{text}<br/>Expiry</span>}
            <RenderDashboardButtonsForExpiryOnlyButtonIcon onCount={onCount} expiry_date={expiry_date}/>
        </Button>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderDashboardButtonsForExpiryOnlyButtonIcon">
@observer
class RenderDashboardButtonsForExpiryOnlyButtonIcon extends React.Component {
    @observable state = {
        count: null
    };
    
    componentDidMount() {
        const {onCount, expiry_date} = this.props;
        onCount(expiry_date).then(count => {
            this.state.count = count;
            console.log('RenderDashboardButtonsForExpiryOnlyButtonIcon', expiry_date, count)
        });
    }
    
    @computed get count() {
        return this.state.count;
    }
    
    render() {
        const {count} = this;
        const className = count ? 'loaded' : 'loading';
        return <i className={className}>{count}</i>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderLeftButtonsForExpiryOnly">
@observer
class RenderLeftButtonsForExpiryOnly extends React.Component {

    @observable state = {
        selected: 'ALL'
    };
    
    constructor() {
        super();

        this.onChangeExpiryOptions = this.onChangeExpiryOptions.bind(this);
    }
    
    onChangeExpiryOptions(evt, btn) {
        const {page, page: {refs: {root}}} = this;
        if(!root) {
            return;
        }
        const {body} = root.refs;
        body.state.dataLoaded = false;
        const {expiry_date} = btn.props;
        
        this.state.selected = expiry_date;

        page.setView({view: this.view, expiry_date, load: true});
    }
    
    get view() {
        const {selfState, state} = this.page;
        const {view} = selfState || state;
        return view;
    }

    get page() {
        return this.props.page;
    }

    render() {
        const {state, onChangeExpiryOptions} = this;
        return <div className="left-buttons pull-left expiry-btns">
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={null} className="bg-border-white color_black" text="No Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={-1} className="bg-border-grey" text="Expired" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={1} className="bg-border-red" text="1 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={2} className="bg-border-orange color_black" text="2 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={3} className="bg-border-yellow color_black" text="3 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={4} className="bg-border-green" text="+4 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date='ALL' className="padding-l-10 padding-r-10" text="All" onClick={onChangeExpiryOptions}/>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderLeftButtonsForExpiryOnly_firebase">
@observer
class RenderLeftButtonsForExpiryOnly_firebase extends React.Component {

    @observable state = {
        selected: 'ALL'
    };

    constructor() {
        super();

        this.onChangeExpiryOptions = this.onChangeExpiryOptions.bind(this);
    }

    onChangeExpiryOptions(evt, btn) {
        const {root} = this.page.refs;
        if(!root) {
            return;
        }
        const {body} = root.refs;
        body.state.dataLoaded = false;
        const {expiry_date} = btn.props;

        this.state.selected = expiry_date;

        if(expiry_date === 'ALL') {
            body.onLoadList();
            return;
        }

        let {path, path: {data}} = this.page;
        if (isObject(path)) {
            path = path.path;
        } else {
            path += "list";
        }
        console.log(path + "/filter", {expiry_date})
        workers.emit(path + "/filter", {expiry_date, ...(data || {})}).then(res => {
            console.log(path + "/filter res", res)
            console.log("dataStale", body.dataStale)
            if (body.dataStale)
                return;

            if (res) {
                if (res.isEmpty()) {
                    body.resultsEmpty();
                }
                root.state.list = res;
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
    }

    get page() {
        return this.props.page;
    }

    render() {
        const {state, onChangeExpiryOptions} = this;
        return <div className="left-buttons pull-left expiry-btns">
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={null} className="bg-border-white color_black" text="No Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={-1} className="bg-border-grey" text="Expired" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={1} className="bg-border-red" text="1 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={2} className="bg-border-orange color_black" text="2 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={3} className="bg-border-yellow color_black" text="3 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date={4} className="bg-border-green" text="+4 Month Expiry" onClick={onChangeExpiryOptions}/>
            <RenderLeftButtonsForExpiryOnlyButton state={state} expiry_date='ALL' className="padding-l-10 padding-r-10" text="All" onClick={onChangeExpiryOptions}/>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderLeftButtonsForExpiryOnlyButton">
@observer
class RenderLeftButtonsForExpiryOnlyButton extends React.Component {
    render() {
        let {state = {}, className, onClick, text, expiry_date} = this.props;
        const {selected} = state;
        className += ` btn btn-primary pull-right font-size-12 no-border-width no-text-shadow ${selected === expiry_date ? " expiry-btns__selected" : ""}`;
        return <Button key={text} expiry_date={expiry_date} className={className} text={text} onClick={onClick}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderLeftButtonsForTeamAttendanceOnly">
function renderLeftButtonsForTeamAttendanceOnly() {
    return <div className="left-buttons pull-left expiry-btns">
        <Button className="btn btn-primary pull-right bg-border-green font-size-12 no-border-width no-text-shadow" text="Paid"/>
        <Button className="btn btn-primary pull-right bg-border-white font-size-12 no-border-width no-text-shadow color_black" text="No Working Hrs"/>
        <Button className="btn btn-primary pull-right bg-border-orange font-size-12 no-border-width no-text-shadow color_black" text="Overtime"/>
        <Button className="btn btn-primary pull-right bg-border-red font-size-12 no-border-width no-text-shadow" text="Lost Hrs"/>
    </div>;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderLeftButtonsForExpiryOnly">
function renderLeftButtonsForExpiryOnly() {
    return <RenderLeftButtonsForExpiryOnly page={this}/>;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderLeftButtonsForExpiryOnly_firebase">
function renderLeftButtonsForExpiryOnly_firebase() {
    return <RenderLeftButtonsForExpiryOnly_firebase page={this}/>;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderLeftButtonsForTasksExpiryOnly">
function renderLeftButtonsForTasksExpiryOnly() {
    return <div className="left-buttons pull-left expiry-btns">
        <Button className="btn btn-primary pull-right bg-border-grey font-size-12 no-border-width no-text-shadow" text="Expired"/>
        <Button className="btn btn-primary pull-right bg-border-green font-size-12 no-border-width no-text-shadow" text="Not Expired"/>
    </div>;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderExpiryDateSpan">
function renderExpiryDateSpan(expiry) {
    if(!expiry) {
        return 'N/A';
    }
    let color = ExpiryCodes.colorClassName(expiry);
    let colorClass;
    if(color.contains('yellow') || color.contains('orange')) {
        colorClass = 'color_black';
    } else {
        colorClass = 'color_white';
    }
    
    const days = ExpiryCodes.daysPrev(expiry);
    let due;
    if(days !== null) {
        const exactDays = Math.floor(days);
        if(exactDays === 0) {
            due = 'Due today';
        } else if(exactDays > 0) {
            due = `${exactDays} days due`;
        } else if(exactDays < 0) {
            due = `Due in ${-exactDays} day${exactDays === -1 ? '' : 's'}`;
        }
    }    
    
    return <span className={'renderExpiryDateSpan font-size-13 bg-' + color + ' ' + colorClass}>
        {Dates.formatDate(expiry)}
        {due && <b className="days-due">{due}</b>}
    </span>;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="renderExpiryDateGreyOrGreenSpan">
function renderExpiryDateGreyOrGreenSpan(expiry) {
    if(!expiry) {
        return 'Not Available';
    }
    let color = ExpiryCodes.greyOrGreenColorClassName(expiry);
    let colorClass = 'color_white';
    
    const days = ExpiryCodes.daysPrev(expiry);
    let due;
    if(days !== null) {
        const exactDays = Math.floor(days);
        if(exactDays === 0) {
            due = 'Due today';
        } else if(exactDays > 0) {
            due = `${exactDays} days due`;
        } else if(exactDays < 0) {
            due = `Due in ${-exactDays} day${exactDays === -1 ? '' : 's'}`;
        }
    }    
    
    return <span className={'renderExpiryDateSpan renderExpiryDateGreyOrGreenSpan font-size-13 bg-' + color + ' ' + colorClass}>
        {Dates.formatDate(expiry)}
        {due && <b className="days-due">{due}</b>}
    </span>;
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ExpiryButtons">
@observer
class ExpiryButtons extends React.Component {
    
    constructor() {
        super();
    }
    
    render() {
        const {list, item, listName} = this.props;
        if(item) {
            const {
                id,
                data: {
                    [listName]: list,
                    [`${listName}_no_expiry_aggregate`]: list_no_expiry_aggregate,
                    [`${listName}_expired_aggregate`]: list_expired_aggregate,
                    [`${listName}_mon_expiry_aggregate`]: list_mon_expiry_aggregate,
                    [`${listName}_2mon_expiry_aggregate`]: list_2mon_expiry_aggregate,
                    [`${listName}_3mon_expiry_aggregate`]: list_3mon_expiry_aggregate,
                    [`${listName}_4mon_expiry_aggregate`]: list_4mon_expiry_aggregate,
                }
            } = item;

            return <>
                <ExpiryBtn count={list.length} title='Total' expiry_date='ALL'/>
                <ExpiryBtn count={list_4mon_expiry_aggregate.aggregate.count} title='+4 Month Expiry' expiry_date={4} className="bg-green"/>
                <ExpiryBtn count={list_3mon_expiry_aggregate.aggregate.count} title='3 Month Expiry' expiry_date={3} className="bg-yellow color_black"/>
                <ExpiryBtn count={list_2mon_expiry_aggregate.aggregate.count} title='2 Month Expiry' expiry_date={2} className="bg-orange color_black"/>
                <ExpiryBtn count={list_mon_expiry_aggregate.aggregate.count} title='1 Month Expiry' expiry_date={1} className="bg-red"/>
                <ExpiryBtn count={list_expired_aggregate.aggregate.count} title='Expired' expiry_date={-1} className="bg-grey"/>
                <ExpiryBtn count={list_no_expiry_aggregate.aggregate.count} title='No Expiry' expiry_date={null} className="bg-white color_black"/>
            </>;
        }
        return <>
            <ExpiryBtn list={list} title='Total' expiry_date='ALL'/>
            <ExpiryBtn list={list} title='+4 Month Expiry' expiry_date={4} className="bg-green"/>
            <ExpiryBtn list={list} title='3 Month Expiry' expiry_date={3} className="bg-yellow color_black"/>
            <ExpiryBtn list={list} title='2 Month Expiry' expiry_date={2} className="bg-orange color_black"/>
            <ExpiryBtn list={list} title='1 Month Expiry' expiry_date={1} className="bg-red"/>
            <ExpiryBtn list={list} title='Expired' expiry_date={-1} className="bg-grey"/>
            <ExpiryBtn list={list} title='No Expiry' expiry_date={null} className="bg-white color_black"/>
        </>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ExpiryBtn">
@observer
class ExpiryBtn extends React.Component {
    d;
    
    constructor() {
        super();
        
        this.d = new Date().toDayEndDate();
    }
    
    @computed get count() {
        const {d, props: {count, list, expiry_date: __expiry_date}} = this;
        if(isNumber(count)) {
            return count;
        }

        if(__expiry_date === 'ALL') {
            return list.length;
        } else if(__expiry_date === null) {
            return list.filter(v => !v.expiry_date).length;
        } else {
            return list.filter(({expiry_date}) => {
                if (__expiry_date === -1) {
                    return expiry_date <= d.getTime();
                } else if (__expiry_date === 1) {
                    return expiry_date > d.getTime() && expiry_date <= d.addMonths(1).addDays(-1).getTime();
                } else if (__expiry_date === 2) {
                    return expiry_date > d.addMonths(1).addDays(-1).getTime() && expiry_date <= d.addMonths(2).getTime();
                } else if (__expiry_date === 3) {
                    return expiry_date > d.addMonths(2).getTime() && expiry_date <= d.addMonths(3).getTime();
                } else if (__expiry_date === 4) {
                    return expiry_date > d.addMonths(3).getTime();
                }
                return false;
            }).length;
        }
    }
    
    render() {
        let {count, props: {className, onClick, title}} = this;
        className += ` btn btn-primary pull-right font-size-12 padding-0 no-border no-text-shadow circled min-w-30 w-30 h-30`;
        return <Button className={className} text={`${count}`}/>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="GroupByButtons">
@observer
class GroupByButtons extends React.Component {
    
    render() {
        const {props: {state, onChangeGroupBy}} = this;
        const className = `btn btn-primary font-size-12 no-border no-text-shadow min-w-80 w-80`;
        return <div className="GroupByButtons flex-center w-full bg-white">
            <label className="-margin-l-50 -margin-r-15 padding-l-0 padding-t-5 padding-r-25 padding-b-5 border-radius-l-20 bg-white">Group By</label>
            <GroupByBtn state={state} groupBy="Employee" className="border-radius-l-20" onClick={onChangeGroupBy}/>
            <GroupByBtn state={state} groupBy="None" className="border-radius-r-20" onClick={onChangeGroupBy}/>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="GroupByBtn">
@observer
class GroupByBtn extends React.Component {
    
    @computed get isSelected() {
        const {props: {groupBy, state}} = this;
        return state.groupBy === groupBy;
    }
    
    render() {
        let {isSelected, props: {groupBy, onClick, className}} = this;
        className += ` btn btn-primary font-size-12 no-text-shadow min-w-100 w-100`;
        return <Button 
            key={groupBy} 
            groupBy={groupBy} 
            className={`${className}${isSelected ? ' padding-5 no-border' : ' padding-2 border-w-3 bg-white color_black'}`} 
            text={groupBy} 
            onClick={onClick}/>;
    }
}
// </editor-fold>

export {
    RenderDashboardButtonsForExpiryOnly,
    renderLeftButtonsForTeamAttendanceOnly,
    renderLeftButtonsForExpiryOnly_firebase,
    renderLeftButtonsForExpiryOnly,
    renderLeftButtonsForTasksExpiryOnly,
    renderExpiryDateSpan,
    renderExpiryDateGreyOrGreenSpan,
    ExpiryButtons, 
    GroupByButtons
};
