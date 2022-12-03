/* eslint-disable camelcase */

import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";

const OmniMenu = createContext();

function useOmniMenuController() {
  const context = useContext(OmniMenu);

  if (!context) {
    throw new Error("useOmniMenuController should be used inside the OmniMenuControllerProvider.");
  }

  return context;
}

function OmniMenuControllerProvider({ children }) {
  // eslint-disable-next-line no-unused-vars
  let setAnchorEl;
  let setRow;
  // eslint-disable-next-line no-unused-vars
  const onOpen = ({ setAnchorEl: _setAnchorEl, setRow: _setRow }) => {
    setAnchorEl = _setAnchorEl;
    setRow = _setRow;
  };
  const onActionsBtnClick = ({ evt, row }) => {
    setAnchorEl(evt.currentTarget);
    setRow(row);
  };
  const context = useMemo(() => ({ onActionsBtnClick, onOpen }), [onActionsBtnClick, onOpen]);
  return <OmniMenu.Provider value={context}>{children}</OmniMenu.Provider>;
}

OmniMenuControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useOmniMenuController, OmniMenuControllerProvider };
