import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { useOmniMenuController } from "../../context/OmniMenuProvider";

function Comp({ actions, onClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [row, setRow] = React.useState(null);

  const menuController = useOmniMenuController();
  const { onOpen } = menuController;

  onOpen({ setAnchorEl, setRow });

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
    setRow(null);
  };
  const onAction = (action) => {
    setAnchorEl(null);
    onClick({ action, row });
  };

  return (
    <Menu
      id="menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      {actions.map((action, n) => (
        // eslint-disable-next-line react/no-array-index-key
        <MenuItemImpl key={n} action={action} onClick={onAction} />
      ))}
    </Menu>
  );
}

function MenuItemImpl({ action, onClick }) {
  // eslint-disable-next-line no-underscore-dangle
  const __onClick = () => {
    onClick(action);
  };
  return <MenuItem onClick={__onClick}>{action}</MenuItem>;
}

// <editor-fold desc="MenuItemImpl.propTypes">
MenuItemImpl.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  action: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
};
// </editor-fold>

// <editor-fold desc="Comp.propTypes">
Comp.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.any).isRequired,
  onClick: PropTypes.func.isRequired,
};
// </editor-fold>

export default Comp;
