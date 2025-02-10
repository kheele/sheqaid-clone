import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Table, TBody, THead} from 'components/tables';

@observer
class PPEIssueHistoryTab extends React.Component {
    pageKey = "PPEIssueHistoryTab";
    
    @observable
    state = {
        listPPEIssueHistory: []
    };
    
    constructor(props) {
        super(props);
        const {item: {data: {ppe_type_issue_history}}} = this.props;
        this.state.listPPEIssueHistory = ppe_type_issue_history || [];
        
        this.onLoadListPPEIssueHistory = this.onLoadListPPEIssueHistory.bind(this);
        this.renderPPEIssueHistoryItem = this.renderPPEIssueHistoryItem.bind(this);
    }

    onLoadListPPEIssueHistory() {
        return Promise.resolve(this.state.listPPEIssueHistory);
    }

    renderPPEIssueHistoryItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.item}</div>
            <div className="td fixed-flex min-w-150">{item.issue_date}</div>
            <div className="td fixed-flex min-w-150">{item.expiry_date}</div>
        </React.Fragment>);
    }

    render() {
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="row">
                    <label></label>
                    <Table>
                        <THead>
                        <div className="td">Item</div>
                        <div className="td">Issue Date</div>
                        <div className="td">Expiry Date</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="PPE Issue History" renderItem={this.renderPPEIssueHistoryItem} onClick={this.onClick} listName="listPPEIssueHistory" state={this.state} onLoadList={this.onLoadListPPEIssueHistory} disablePullToRefresh={true}/>
                    </Table>
                </div>
            </div>
        </div>;
    }
}

export default PPEIssueHistoryTab;
