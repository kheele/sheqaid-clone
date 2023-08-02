import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import style from "./TrainingRegisterList.lazy.css";
import {Dates} from '../../utils/Utils';
import APageListReadWrite from "../../views/APageListReadWrite";
import {Button} from '../inputs';
import {THead, TRow} from '../tables';

@observer
class TrainingRegisterList extends React.Component {
    static propTypes = {
        listCountTopTitle: PropTypes.string,
        pageTitle: PropTypes.string,
        createBtnTitle: PropTypes.string,
        renderLeftButtons: PropTypes.func,
        renderRightButtons: PropTypes.func,
        renderPopoverOptions: PropTypes.func,
        renderFilterNode: PropTypes.func,
        action: PropTypes.node
    };

    pageKey = "TrainingRegisterList";

    constructor() {
        super();

        this.renderItem = this.renderItem.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderTHead() {
        return <THead>
            <div className="td">Training</div>
            <div className="td">Trainer</div>
            <div className="td">Time / Duration</div>
            <div className="td">Date</div>
            <div className="td">No. Of Attendants</div>
            <div className="td fixed-flex"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data:{created_at, training, trainer, time_or_duration, date, list_proof, list_table}} = item;
        const {action} = this.props;
        return <TRow key={id}>
            <div className="td">{training.name}</div>
            <div className="td">{trainer.fname + ' ' + trainer.lname}</div>
            <div className="td">{time_or_duration}</div>
            <div className="td">{Dates.formatDate(date)}</div>
            <div className="td">{list_table ? list_table.length : 'Not Available'}</div>
            <div className="td fixed-flex">
                {this.renderAction(action, n, onClick)}
            </div>
        </TRow>;
    }

    renderAction(action, n, onClick) {
        if (isFunction(action)) {
            return action(n);
        }

        return action.type.name === 'Button' ? action : 
	<Button idx={n} className="btn btn-primary pull-right" onClick={onClick}>
            {action}
	</Button>;
    }

    render() {
        const {page, path, listCountTopTitle, pageTitle, createBtnTitle, renderLeftButtons, renderRightButtons, renderPopoverOptions, renderFilterNode, onClick, children} = this.props;
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            listPage={page}
            createBtnTitle={createBtnTitle}
            pageId={this.pageKey}
            listCountTopTitle={listCountTopTitle}
            pageTitle={pageTitle}
            pageTitleSingular="training register"
            path={path}
            noAnimation={true}
            renderLeftButtons={renderLeftButtons}
            renderRightButtons={renderRightButtons}
            renderPopoverOptions={renderPopoverOptions}
            renderFilterNode={renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}
            onClick={onClick}>
            {children}
        </APageListReadWrite>;
    }
}

export default TrainingRegisterList;
