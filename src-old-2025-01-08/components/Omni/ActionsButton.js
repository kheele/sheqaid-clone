import * as React from "react";
import PropTypes from "prop-types";
import { useOmniMenuController } from "context/OmniMenuProvider";
import MKButton from "../MK/MKButton";

function Comp({ row }) {
  const menuController = useOmniMenuController();
  const { onActionsBtnClick } = menuController;
  const onClick = (evt) => {
    onActionsBtnClick({ evt, row });
  };
  return (
    <MKButton color="info" row={row} onClick={onClick}>
      Actions
    </MKButton>
  );
}

// <editor-fold desc="Comp.propTypes">
Comp.propTypes = {
  row: PropTypes.objectOf(PropTypes.object).isRequired,
};
// </editor-fold>

export default Comp;
