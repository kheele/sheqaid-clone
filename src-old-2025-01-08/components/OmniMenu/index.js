import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import {useOmniMenuController} from "../../context/OmniMenuProvider";
import {Permissions} from "../../utils/Utils";

function Comp(
    {
        permissionModKey,
        permissionOtherKey,
        readonly,
        override,
        actions,
        onClick,
        onView,
        onEdit,
        onRemove,
    }
) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [row, setRow] = React.useState(null);

    const menuController = useOmniMenuController();
    const {onOpen} = menuController;

    onOpen({setAnchorEl, setRow});

    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
        setRow(null);
    };
    const onAction = (action) => {
        setAnchorEl(null);
        // onClick({ action, row });
        if (isString(action)) {
            switch (action) {
                case "view": {
                    onView(row);
                    break;
                }
                case "edit": {
                    onEdit(row);
                    break;
                }
                case "remove": {
                    onRemove(row);
                    break;
                }
            }
        } else if (action.onClick) {
            action.onClick(row);
        } else if (action.action) {
            switch (action.action) {
                case "view": {
                    onView(row);
                    break;
                }
                case "edit": {
                    onEdit(row);
                    break;
                }
                case "remove": {
                    onRemove(row);
                    break;
                }
            }
        }
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
            {open && (isFunction(actions) ? actions(row) : actions).filter(v => !!v).map((__action, n) => {
                // eslint-disable-next-line react/no-array-index-key
                if (isString(__action)) {
                } else if (__action.action) {
                    const action = __action.action.toLowerCase();

                    const isWritable = () => {
                        if (!action) return false;
                        return action === 'writable' || action === 'edit' || action === 'remove';
                    };

                    const isSavable = () => {
                        if (!action) return false;
                        return action === 'download' || action === 'save-pdf' || action === 'print' || action === 'share';
                    };

                    if (action) {
                        if (isWritable() || isSavable()) {
                            const {isEmployee, isContractorViewVisited} = storage.is;
                            if (readonly && (action === 'edit' || action === 'remove')) return undefined;
                            if (isEmployee) return undefined;
                            if (!override && isContractorViewVisited) return undefined;
                        }
                    }

                    const {permissions_modules, permissions_other} = storage.loggedUser.user.data;
                    let permissions;
                    if (permissionModKey) {
                        permissions = (permissions_modules || []).find(v => v.key === permissionModKey);
                    } else if (permissionOtherKey) {
                        permissions = (permissions_other || []).find(v => v.key === permissionOtherKey);
                    }

                    switch (action) {
                        case "view": {
                            //console.log(action, ' : ',  (permissions && Permissions.disallowView(permissions)))
                            if (permissions && Permissions.disallowView(permissions)) return null;
                            else break;
                        }
                        case "edit": {
                            //console.log(action, ' : ',  (readonly || (permissions && Permissions.disallowEdit(permissions))))
                            if (readonly || (permissions && Permissions.disallowEdit(permissions))) return null;
                            else break;
                        }
                        case "remove": {
                            //console.log(action, ' : ',  (readonly || (permissions && Permissions.disallowRemove(permissions))))
                            if (readonly || (permissions && Permissions.disallowRemove(permissions))) return null;
                            else break;
                        }
                        case "share": {
                            if (permissions && Permissions.disallowShare(permissions)) return null;
                            else break;
                        }
                        case "download":
                        case "save-pdf":
                        case "print": {
                            if (permissions && Permissions.disallowPrint(permissions)) return null;
                            else break;
                        }
                    }
                }

                return <MenuItemImpl key={n} action={__action} onClick={onAction}/>;
            })}
        </Menu>
    );
}

function MenuItemImpl({action, onClick}) {
    // eslint-disable-next-line no-underscore-dangle
    const __onClick = () => {
        onClick(action);
    };
    return <MenuItem onClick={__onClick}>{isString(action) ? action : action.title}</MenuItem>;
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
