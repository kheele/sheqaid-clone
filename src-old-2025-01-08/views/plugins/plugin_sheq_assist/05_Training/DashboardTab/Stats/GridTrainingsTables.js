//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import Card from "@mui/material/Card";
import MDTypography from "components/MD/MDTypography";
import UpcomingTrainingsTable from "./UpcomingTrainingsTable";
import RecentTrainingsTable from "./RecentTrainingsTable";
//</editor-fold>

//<editor-fold desc="Comp">
function Comp() {
    return <Grid
        item
        columns={1}
        spacing={0}
        className="grid-1 w-full grid-gap-10"
        sx={{
            m: 0, mt: '30px',
        }}
    >
        <MDBox mb={-2} ml="-20px" mr="-20px">
            <Card sx={{background: "#f1f1f1", ml: '10px', mr: '10px', mb: '5px'}}>
                <MDTypography className="padding-15 font-size-16">Upcoming Trainings</MDTypography>
            </Card>
            <UpcomingTrainingsTable/>
        </MDBox>
        <MDBox mb={-5} ml="-20px" mr="-20px">
            <Card sx={{background: "#f1f1f1", ml: '10px', mr: '10px', mb: '5px'}}>
                <MDTypography className="padding-15 font-size-16">Recent Trainings</MDTypography>
            </Card>
            <RecentTrainingsTable/>
        </MDBox>
    </Grid>;
}

//</editor-fold>

// Comp.propTypes = {
//     value: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
// };

export default Comp;
