import React from "react";
import {observer} from 'mobx-react';

import AggregateStat from "components/AggregateStat";

@observer
class AListTab extends React.Component {
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);

        this.renderTHead = this.renderTHead.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {list} = this.props;
        if (list) {
            return this.findByIdsEmployees(list.map(({id}) => id));
        }

        const paramsProps = this.props.params || {};

        params = {...params, ...paramsProps};

        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            department_id,
            job_position_id,
            job_category_id,
            team_id,
            supervisor_id,
            name,
            id_or_pass_num,
        } = filterData || {};

        const listByLogged = sockets.of('employees').fn('listByLogged');

        return listByLogged({
            removed: this.removed,
            //
            department_id,
            job_position_id,
            job_category_id,
            team_id,
            supervisor_id,
            name,
            id_or_pass_num,
            //
            exact_orgs: true,
            //
            offset: isNew ? 0 : this.refs.root.list.length,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="StatsPanel">
@observer
class StatsPanel extends React.Component {

    render() {
        const {
            data: {
                medical_list_aggregate, leave_list_aggregate, ppe_type_list_aggregate,
                trainer_training_list_aggregate, warning_list_aggregate,
                supervisor_employee_list_aggregate,
            }
        } = this.props.item;

        return <>
            {/*<AggregateStat title="Employees" value={supervisor_employee_list_aggregate} color=""/>*/}
            <AggregateStat title="PPE" value={ppe_type_list_aggregate} color="rgb(90, 106, 116)"/>
            <AggregateStat title="Competencies" value={trainer_training_list_aggregate} color="rgb(1, 100, 93)"/>
            <AggregateStat title="Sign-Off" value={leave_list_aggregate} color="rgb(11, 126, 145)"/>
            <AggregateStat title="Medicals" value={medical_list_aggregate} color="rgb(76, 121, 129)"/>
            {/*<AggregateStat title="Warnings" value={warning_list_aggregate} color=""/>*/}
        </>;
    }
}

// </editor-fold>

export {StatsPanel};
export default AListTab;
