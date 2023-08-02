/* */

import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MD/MDBox";
import MDTypography from "components/MD/MDTypography";

function ComplexStatisticsCard({ className, color, title, count, percentage, icon, sx }) {
  return (
    <Card sx={{ background: "#f5f5f5", marginTop: "28px", height: "120px", ...sx }} className={className}>
      <MDBox
        pt={1}
        px={2}
        mb={0.5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt="-85px"
          mb="30px"
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="center" lineHeight={3} mt={2}>
          <MDTypography variant="h4" fontWeight="light" color="inherittext">
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={0} pt="3px" px={0} sx={{ display: "flex", justifyContent: "center" }}>
        <MDTypography
          component="p"
          variant="button"
          color="text"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            textAlign="center"
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
          &nbsp;{percentage.label}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
  sx: {},
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
  sx: PropTypes.objectOf(PropTypes.object),
};

export default ComplexStatisticsCard;
