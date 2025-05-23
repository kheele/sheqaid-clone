//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef} from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MD/MDBox";
import VerticalBarChart from "containers/Charts/BarCharts/VerticalBarChart";
//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef((
    {
        data: {topStats},//[{id, month_year: date.formatMonthYear(), count}]
    }, ref) => {

    const defaults = {aggregate: {count: 0, sum: {amount: 0}}};

    const {
        list_category_beverage_clients_and_training_aggregate = defaults,
        list_category_business_technologies_aggregate = defaults,
        list_category_education_or_training_aggregate = defaults,
        list_category_fuel_and_oil_aggregate = defaults,
        list_category_kilometers_aggregate = defaults,
        list_category_material_or_project_supplies_aggregate = defaults,
        list_category_meals_and_entertainment_aggregate = defaults,
        list_category_medical__employer_contribution_aggregate = defaults,
        list_category_office_expense__refreshments_aggregate = defaults,
        list_category_office_supplies_or_printing_and_stationary_aggregate = defaults,
        list_category_other_aggregate = defaults,
        list_category_parking_and_tolls_aggregate = defaults,
        list_category_postage_aggregate = defaults,
        list_category_professional_registrations_or_memberships_aggregate = defaults,
        list_category_rent_aggregate = defaults,
        list_category_repairs_and_maintenance_aggregate = defaults,
        list_category_staff_welfare_and_gifts_aggregate = defaults,
        list_category_telephone_and_internet_aggregate = defaults,
        list_category_transportation_public_aggregate = defaults,
        list_category_travel_and_accommodation_aggregate = defaults,
    } = topStats;

    const getCategoryCount = (category_aggregate) => {
        if (!category_aggregate || !category_aggregate.aggregate) return 0;
        return category_aggregate.aggregate.count || 0;
    };

    const getCategorySum = (category_aggregate) => {
        if (!category_aggregate || !category_aggregate.aggregate || !category_aggregate.aggregate.sum) return 0;
        const {amount} = category_aggregate.aggregate.sum;
        return amount ? parseFloat(amount.replace('$', '')) : 0;
    };

    const chartCategories = {
        labels: [
            "Beverage-clients and Training",
            "Business Technologies",
            "Education / Training",
            "Fuel and Oil",
            "Kilometers",
            "Material/Project Supplies",
            "Meals and Entertainment",
            "Medical - Employer Contribution",
            "Office Expense-Refreshments",
            "Office Supplies/Printing and Stationary",
            "Other",
            "Parking and Tolls",
            "Postage",
            "Professional Registrations/Memberships",
            "Rent",
            "Repairs and Maintenance",
            "Staff Welfare and Gifts",
            "Telephone and Internet",
            "Transportation (taxi, bus, train)",
            "Travel and Accommodation",
        ],
        datasets: [
            {
                label: 'Total No.',
                color: 'light',
                data: [
                    getCategoryCount(list_category_beverage_clients_and_training_aggregate),
                    getCategoryCount(list_category_business_technologies_aggregate),
                    getCategoryCount(list_category_education_or_training_aggregate),
                    getCategoryCount(list_category_fuel_and_oil_aggregate),
                    getCategoryCount(list_category_kilometers_aggregate),
                    getCategoryCount(list_category_material_or_project_supplies_aggregate),
                    getCategoryCount(list_category_meals_and_entertainment_aggregate),
                    getCategoryCount(list_category_medical__employer_contribution_aggregate),
                    getCategoryCount(list_category_office_expense__refreshments_aggregate),
                    getCategoryCount(list_category_office_supplies_or_printing_and_stationary_aggregate),
                    getCategoryCount(list_category_other_aggregate),
                    getCategoryCount(list_category_parking_and_tolls_aggregate),
                    getCategoryCount(list_category_postage_aggregate),
                    getCategoryCount(list_category_professional_registrations_or_memberships_aggregate),
                    getCategoryCount(list_category_rent_aggregate),
                    getCategoryCount(list_category_repairs_and_maintenance_aggregate),
                    getCategoryCount(list_category_staff_welfare_and_gifts_aggregate),
                    getCategoryCount(list_category_telephone_and_internet_aggregate),
                    getCategoryCount(list_category_transportation_public_aggregate),
                    getCategoryCount(list_category_travel_and_accommodation_aggregate),
                ],
            },
            {
                label: 'Total Amount',
                color: 'success',
                data: [
                    getCategorySum(list_category_beverage_clients_and_training_aggregate),
                    getCategorySum(list_category_business_technologies_aggregate),
                    getCategorySum(list_category_education_or_training_aggregate),
                    getCategorySum(list_category_fuel_and_oil_aggregate),
                    getCategorySum(list_category_kilometers_aggregate),
                    getCategorySum(list_category_material_or_project_supplies_aggregate),
                    getCategorySum(list_category_meals_and_entertainment_aggregate),
                    getCategorySum(list_category_medical__employer_contribution_aggregate),
                    getCategorySum(list_category_office_expense__refreshments_aggregate),
                    getCategorySum(list_category_office_supplies_or_printing_and_stationary_aggregate),
                    getCategorySum(list_category_other_aggregate),
                    getCategorySum(list_category_parking_and_tolls_aggregate),
                    getCategorySum(list_category_postage_aggregate),
                    getCategorySum(list_category_professional_registrations_or_memberships_aggregate),
                    getCategorySum(list_category_rent_aggregate),
                    getCategorySum(list_category_repairs_and_maintenance_aggregate),
                    getCategorySum(list_category_staff_welfare_and_gifts_aggregate),
                    getCategorySum(list_category_telephone_and_internet_aggregate),
                    getCategorySum(list_category_transportation_public_aggregate),
                    getCategorySum(list_category_travel_and_accommodation_aggregate),
                ],
            },
        ],
    };

    return <Grid
        container
        className="grid-1 grid-gap-10 pos-relative"
        sx={{
            m: '0',
            width: 'calc(100% - 10px) !important',
            height: "615px",
            // height: "calc(100% - 216px)",
            position: 'absolute',
            left: '10px',
            bottom: '0px',
            right: '0px',
        }}
    >
        <Grid item
              className="grid-1 w-full grid-gap-10"
              sx={{
                  padding: "0 !important",
                  height: `100%`,
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  right: '0',
                  bottom: '0',
              }}
        >
            <MDBox
                className="grid-1 w-full grid-gap-10"
                sx={{
                    m: 0,
                    mb: '10px',
                    justifyItems: 'center',
                    background: "#fff",
                    borderRadius: "20%",
                }}
            >
                <VerticalBarChart
                    height="500px"
                    title="Approved Expenses Per Category"
                    color="#fff"
                    tickColor="#fff"
                    background="#3f4548"
                    displayLegend={true}
                    chart={chartCategories}
                />
            </MDBox>
        </Grid>
    </Grid>;
});

//</editor-fold>

export default Comp;
