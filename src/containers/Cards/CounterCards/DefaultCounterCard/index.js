/* */

// <editor-fold desc="imports">
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// react-countup component
import CountUp from "react-countup";

// Material Kit 2 React components
import MKBox from "components/MK/MKBox";
import MKTypography from "components/MK/MKTypography";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
// </editor-fold>

function DefaultCounterCard({ sx = {}, color, background, count, radius, label, title, desc, ...rest }) {
  return (
      <MKBox p={2} textAlign="center" lineHeight={1} sx={{ background, borderRadius: radius, ...sx }}>
        <MKTypography variant="h1" color={color} textGradient>
          <Loader count={count} {...rest} />{label || ''}
        </MKTypography>
        {title && (
            <MKTypography variant="h5" mt={2} mb={1}>
              {title}
            </MKTypography>
        )}
        {desc && (
            <MKTypography variant="body2" color="text">
              {desc}
            </MKTypography>
        )}
      </MKBox>
  );
}

function Loader({ count, ...rest }) {
  const [end, setEnd] = useState(-1);
  useEffect( () => {
    (async () => {
      if(count instanceof Promise) {
        count = await count;
      }
      setEnd(count);
    })();
  }, [count]);

  if(end === -1) {
    return <CircularProgress size='1em'/>;
  }

  return (<CountUp end={end} duration={2} {...rest} />);
}

// Setting default props for the DefaultCounterCard
DefaultCounterCard.defaultProps = {
  color: "info",
  background: "white",
  radius: "0",
  desc: "",
  title: "",
};

// Typechecking props for the DefaultCounterCard
DefaultCounterCard.propTypes = {
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
  background: PropTypes.string,
  radius: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Promise)]).isRequired,
  title: PropTypes.string,
  desc: PropTypes.string,
};

export default DefaultCounterCard;
