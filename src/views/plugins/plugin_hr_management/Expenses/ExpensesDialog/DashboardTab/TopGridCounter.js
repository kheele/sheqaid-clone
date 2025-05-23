//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef} from "react";
import Grid from "@mui/material/Grid";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {getRandomRolor} from "utils/UtilsFuns";
import PropTypes from "prop-types";
//</editor-fold>

//<editor-fold desc="GridCounter">
const Comp = forwardRef((
    {
        titlePlural,
        topStatsSize,
        data,

        onViewRemovedTab,
        onViewUnsubmitted,
        onViewAwaitingApproval,
        onViewAwaitingPayment,
        onViewCompleted,
        onViewRejected,
    }, ref) => {

    const {
        list_unsubmitted_aggregate,
        list_awaiting_approval_aggregate,
        list_awaiting_payment_aggregate,
        list_completed_aggregate,
        list_rejected_aggregate,

        list_removed_aggregate,
    } = data || {};

    return <Grid
        container
        columns={1}
        className="grid-6 w-full grid-gap-10"
        sx={{m: 0, mt: '15px', mb: "15px", p: "20px", background: "white", justifyItems: 'center',}}
    >
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Unsubmitted</b>}
                 count={list_unsubmitted_aggregate && list_unsubmitted_aggregate.aggregate.count || 0}
                 onClick={onViewUnsubmitted}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Awaiting Approval</b>}
                 count={list_awaiting_approval_aggregate && list_awaiting_approval_aggregate.aggregate.count || 0}
                 onClick={onViewAwaitingApproval}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Awaiting Payment</b>}
                 count={list_awaiting_payment_aggregate && list_awaiting_payment_aggregate.aggregate.count || 0}
                 onClick={onViewAwaitingPayment}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Completed</b>}
                 count={list_completed_aggregate && list_completed_aggregate.aggregate.count || 0}
                 onClick={onViewCompleted}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Rejected</b>}
                 count={list_rejected_aggregate && list_rejected_aggregate.aggregate.count || 0}
                 onClick={onViewRejected}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Removed</b>}
                 count={list_removed_aggregate && list_removed_aggregate.aggregate.count || 0}
                 onClick={onViewRemovedTab}
        />
    </Grid>;
});
//</editor-fold>

Comp.defaultProps = {
    topStatsSize: 150,
};

Comp.propTypes = {
    topStatsSize: PropTypes.number,
};

export default Comp;
