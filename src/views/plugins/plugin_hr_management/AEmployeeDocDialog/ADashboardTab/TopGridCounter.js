//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef} from "react";
import {getRandomRolor} from "utils/UtilsFuns";
import PropTypes from "prop-types";
//</editor-fold>

//<editor-fold desc="GridCounter">
const Comp = forwardRef((
    {
        titlePlural,
        topStatsSize,
        data: {
            list_active_aggregate,
            list_removed_aggregate,
            list_no_expiry_aggregate,
            list_expired_aggregate,
            list_mon_expiry_aggregate,
            list_2mon_expiry_aggregate,
            list_3mon_expiry_aggregate,
            list_4mon_expiry_aggregate,
        },

        onViewActiveTab,
        onViewRemovedTab,
        onViewNoExpiry,
        onViewExpired,
        onViewMonExpiry,
        onView2MonExpiry,
        onView3MonExpiry,
        onView4MonExpiry,
    }, ref) => {

    return <Grid
        container
        columns={1}
        spacing={5}
        className="grid-8 w-full grid-gap-10"
        sx={{m: 0, mt: '20px', mb: "0px", p: "20px", background: "white", justifyItems: 'center',}}
    >
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Active</b>}
                 count={list_active_aggregate.aggregate.count}
                 onClick={onViewActiveTab}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Removed</b>}
                 count={list_removed_aggregate.aggregate.count}
                 onClick={onViewRemovedTab}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">No Expiry</b>}
                 count={list_no_expiry_aggregate.aggregate.count}
                 onClick={onViewNoExpiry}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Expired</b>}
                 count={list_expired_aggregate.aggregate.count}
                 onClick={onViewExpired}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">1 Month Expiry</b>}
                 count={list_mon_expiry_aggregate.aggregate.count}
                 onClick={onViewMonExpiry}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">2 Month Expiry</b>}
                 count={list_2mon_expiry_aggregate.aggregate.count}
                 onClick={onView2MonExpiry}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">3 Month Expiry</b>}
                 count={list_3mon_expiry_aggregate.aggregate.count}
                 onClick={onView3MonExpiry}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">+4 Month Expiry</b>}
                 count={list_4mon_expiry_aggregate.aggregate.count}
                 onClick={onView4MonExpiry}
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
