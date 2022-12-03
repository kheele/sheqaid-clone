import * as React from "react";
import PropTypes from "prop-types";
import MKBox from "../MK/MKBox";

function Comp({ img }) {
  if (!img) return null;
  return (
    <MKBox
      component="img"
      src={img.url.dlUrls}
      alt=""
      maxWidth="60px"
      maxHeight="60px"
      m="-14px 0 -20px"
    />
  );
}

// <editor-fold desc="Comp.propTypes">
Comp.propTypes = {
  img: PropTypes.objectOf(PropTypes.object).isRequired,
};
// </editor-fold>

export default Comp;
