// <editor-fold defaultstate="collapsed" desc="imports">
import {observer} from 'mobx-react';
import {autorun} from 'mobx';

import {execWhen, Permissions} from 'utils/Utils';
import {AEditDialog} from 'components/dialogs';

import {ControlsContractor, ControlsUser} from './EditDialogControls';

import style from "./EditDialog.lazy.css";
import findByIdUser from "mutations/all/User/findByIdUser";
import findByIdContractorUser from "mutations/all/ContractorUser/findByIdContractorUser";
import updateContractorUser from "mutations/all/ContractorUser/updateContractorUser";
import {updateUser} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "User";

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {isContractor} = storage.is;
        return isContractor ? findByIdContractorUser : findByIdUser;
    }

    get removeById() {
        const {isContractor} = storage.is;
        const onUpdate = isContractor ? updateContractorUser : updateUser;
        if (!this.isOpen) return onUpdate;

        const {item} = this.state;
        if (!item) return null;

        return onUpdate;
    }

    get title() {
        const {shouldSetupPermissions} = storage.is;
        if (shouldSetupPermissions) {
            return "Complete My Account";
        }
        return this.isLoggedUser ? "Edit My Profile" : "Edit User Profile";
    }

    get noBackAction() {
        return this.props.forShouldSetupPermissions;
    }

    get preventEsc() {
        return this.props.forShouldSetupPermissions;
    }

    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_other_list} = user.data;
        const permissions_other_Users = (permissions_other_list || []).find(v => v.key.value === "Users");
        //TODO: Give contractors permissions
        if (!Permissions.allowRemove(permissions_other_Users)) {
            return true;
        }
        return this.isLoggedUser;
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        const {item} = this.state;
        return item && item.id === user.id;
    }

    get controls() {
        const {isContractor} = storage.is;
        return isContractor ? ControlsContractor : ControlsUser;
    }

    componentDidMount() {
        super.componentDidMount();
        const {forShouldSetupPermissions} = this.props;
        if (!forShouldSetupPermissions) {
            return;
        }
        autorun(() => {
            if (storage.is.isLoggedIn) {
                const {is: {shouldSetupPermissions}} = storage;

                if (shouldSetupPermissions) {
                    execWhen(() => this.refs.dialog).then(dialog => {
                        const {loggedUser: {user}} = storage;
                        this.open(user);
                        execWhen(() => dialog.refs.cancel).then(cancel => {
                            cancel.text('Logout');
                        });
                    });
                }
            }
        });
    }

    onCancel(e, btn) {
        const {forShouldSetupPermissions} = this.props;
        if (forShouldSetupPermissions) {
            storage.logout.signOutAndConfirm();
        } else {
            super.onCancel(e, btn);
        }
    }
}

// </editor-fold>

export default EditDialog;
