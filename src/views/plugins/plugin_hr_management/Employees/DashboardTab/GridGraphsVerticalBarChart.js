//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef} from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
import {getRandomRolor} from "utils/Utils";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {Clickable} from 'components/inputs';
//</editor-fold>

const renderItemDocs = (data, onViewDialog) => {
    return ({key, compRef, text, listName, noExpiry}) => {
        // const {onViewDialog} = this.props;

        const {
            [`${listName}_active_aggregate`]: list_active_aggregate,
            [`${listName}_no_expiry_aggregate`]: list_no_expiry_aggregate,
            [`${listName}_expired_aggregate`]: list_expired_aggregate,
            [`${listName}_mon_expiry_aggregate`]: list_mon_expiry_aggregate,
            [`${listName}_2mon_expiry_aggregate`]: list_2mon_expiry_aggregate,
            [`${listName}_3mon_expiry_aggregate`]: list_3mon_expiry_aggregate,
            [`${listName}_4mon_expiry_aggregate`]: list_4mon_expiry_aggregate,
        } = data;

        const chart = {
            labels: ['No Expiry', 'Expired', '1 Month Expiry', '2 Month Expiry', '3 Month Expiry', '+4 Month Expiry'],
            datasets: [{
                label: '',
                color: 'white',
                data: [
                    list_no_expiry_aggregate.aggregate.count,
                    list_expired_aggregate.aggregate.count,
                    list_mon_expiry_aggregate.aggregate.count,
                    list_2mon_expiry_aggregate.aggregate.count,
                    list_3mon_expiry_aggregate.aggregate.count,
                    list_4mon_expiry_aggregate.aggregate.count,
                ],
            }],
        };

        const background = getRandomRolor();

        return <Clickable compRef={compRef} onClick={onViewDialog}>
            <MDBox
                className="grid-1 w-full grid-gap-10"
                sx={{
                    m: 0,
                    mb: '15px',
                    justifyItems: 'center',
                    background: "#fff",
                    padding: "10px 0",
                    borderRadius: "20%",
                }}
            >
                <Counter size={160}
                         color="white"
                         countUpClass="color-white"
                         background={background}
                         title={<b className="color-white font-size-14">Active {text}</b>}
                         count={list_active_aggregate.aggregate.count}
                />
                <VerticalBarChart
                    height="300px"
                    title={text}
                    color="#fff"
                    tickColor="white"
                    background={background}
                    displayLegend={true}
                    chart={chart}
                />
            </MDBox>
        </Clickable>;
    };
};

const renderItemOther = data => {
    return ({key, compRef, text, listName, titleBG, noExpiry}) => {
        // const {onViewDialog} = this.props;

        const {
            [`${listName}_active_aggregate`]: list_active_aggregate,
        } = data;

        const onClick = () => {

        }

        return <Counter size={130}
                        background="#e91e63"
                        title={<b className="color-white font-size-14">Active {text}</b>}
                        count={list_active_aggregate.aggregate.count}
                        onClick={onClick}
        />;
    };
};

//<editor-fold desc="Comp">
const Comp = forwardRef((
    {
        onViewDialog,
        list,
        data, data: {
        competency_list_active_aggregate,
        competency_list_no_expiry_aggregate,
        competency_list_expired_aggregate,
        competency_list_mon_expiry_aggregate,
        competency_list_2mon_expiry_aggregate,
        competency_list_3mon_expiry_aggregate,
        competency_list_4mon_expiry_aggregate,

        contract_list_active_aggregate,
        contract_list_no_expiry_aggregate,
        contract_list_expired_aggregate,
        contract_list_mon_expiry_aggregate,
        contract_list_2mon_expiry_aggregate,
        contract_list_3mon_expiry_aggregate,
        contract_list_4mon_expiry_aggregate,

        job_appointment_list_active_aggregate,
        job_appointment_list_no_expiry_aggregate,
        job_appointment_list_expired_aggregate,
        job_appointment_list_mon_expiry_aggregate,
        job_appointment_list_2mon_expiry_aggregate,
        job_appointment_list_3mon_expiry_aggregate,
        job_appointment_list_4mon_expiry_aggregate,

        counselling_list_active_aggregate,
        counselling_list_no_expiry_aggregate,
        counselling_list_expired_aggregate,
        counselling_list_mon_expiry_aggregate,
        counselling_list_2mon_expiry_aggregate,
        counselling_list_3mon_expiry_aggregate,
        counselling_list_4mon_expiry_aggregate,

        leave_list_active_aggregate,
        leave_list_no_expiry_aggregate,
        leave_list_expired_aggregate,
        leave_list_mon_expiry_aggregate,
        leave_list_2mon_expiry_aggregate,
        leave_list_3mon_expiry_aggregate,
        leave_list_4mon_expiry_aggregate,

        license_list_active_aggregate,
        license_list_no_expiry_aggregate,
        license_list_expired_aggregate,
        license_list_mon_expiry_aggregate,
        license_list_2mon_expiry_aggregate,
        license_list_3mon_expiry_aggregate,
        license_list_4mon_expiry_aggregate,

        medical_list_active_aggregate,
        medical_list_no_expiry_aggregate,
        medical_list_expired_aggregate,
        medical_list_mon_expiry_aggregate,
        medical_list_2mon_expiry_aggregate,
        medical_list_3mon_expiry_aggregate,
        medical_list_4mon_expiry_aggregate,

        warning_list_active_aggregate,
        warning_list_no_expiry_aggregate,
        warning_list_expired_aggregate,
        warning_list_mon_expiry_aggregate,
        warning_list_2mon_expiry_aggregate,
        warning_list_3mon_expiry_aggregate,
        warning_list_4mon_expiry_aggregate,

        work_permit_list_active_aggregate,
        work_permit_list_no_expiry_aggregate,
        work_permit_list_expired_aggregate,
        work_permit_list_mon_expiry_aggregate,
        work_permit_list_2mon_expiry_aggregate,
        work_permit_list_3mon_expiry_aggregate,
        work_permit_list_4mon_expiry_aggregate,

        prdp_list_active_aggregate,
        prdp_list_no_expiry_aggregate,
        prdp_list_expired_aggregate,
        prdp_list_mon_expiry_aggregate,
        prdp_list_2mon_expiry_aggregate,
        prdp_list_3mon_expiry_aggregate,
        prdp_list_4mon_expiry_aggregate,

        id_or_passport_list_active_aggregate,
        id_or_passport_list_no_expiry_aggregate,
        id_or_passport_list_expired_aggregate,
        id_or_passport_list_mon_expiry_aggregate,
        id_or_passport_list_2mon_expiry_aggregate,
        id_or_passport_list_3mon_expiry_aggregate,
        id_or_passport_list_4mon_expiry_aggregate,
    },
    }, ref) => {

    const keys = Object.keys(data);
    list = list.filter(({listName, onFilter}) => {
        if (!listName || listName.startsWith("leave_list")) return false;
        // if(onFilter) return keys.anyMatch(onFilter);
        return keys.anyMatch(k => k.startsWith(listName));
    });
    const list_docs = list.filter(({noExpiry}) => !noExpiry);
    // const list_other = list.filter(({noExpiry}) => !!noExpiry);

    return <Grid
        container
        columns={2}
        spacing={6}
        className="grid-1 w-full grid-gap-10"
        sx={{
            m: 0, justifyItems: 'center',
        }}
    >
        <Grid item
              className="grid-4 w-full grid-gap-10"
              sx={{padding: "0 !important", mb: "0px", justifyItems: 'center',}}
        >
            {list_docs.map(renderItemDocs(data, onViewDialog))}
        </Grid>
        {/*<Grid item sx={{padding: "0 !important", mb: "0px"}}>*/}
        {/*    {list_other.map(renderItemOther(data))}*/}
        {/*</Grid>*/}
    </Grid>;
});

//</editor-fold>

export default Comp;
