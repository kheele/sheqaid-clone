import {observer} from 'mobx-react';
import ACol from "./ACol";
import ARow from "./ARow";
import {NewUserListTable} from "../../../components/FormTableComponents";
import {insertNotificationSettings} from "../../../mutations/create";
import {deleteNotificationSettings} from "../../../mutations/delete";


@observer
class HRPermissionsCol extends ACol {

    title = "HR Permissions";
    sockets = sockets.of("permissions-settings-hr-categories");

    constructor(props) {
        super(props);
    }

    getArgs() {
        const {company,} = storage.loggedUser;
        const {selectedClient,} = storage.selected;

        return {company_id: company.id, client_id: selectedClient.id,};
    }

    renderAccordionSummary(item, idx) {
        return `${item.data.title}`;
    }

    renderAccordionDetails(item, idx) {
        return <Row item={item} idx={idx}/>;
    }

    onAdd(evt, btn) {
        const {idx} = btn.props;
    }

    onRemove(evt, btn) {
        const {idx} = btn.props;
    }
}

@observer
class Row extends ARow {
    listFn = sockets.of("permissions-settings-hr").fn('listByLogged');

    constructor(props) {
        super(props);
    }

    getArgs() {
        const {item: {id: module_id}} = this.props;

        return {module_id, limit: 0,};
    }

    renderList() {
        const {item} = this.props;

        console.log(item);

        return <>
            <NewUserListTable
                name="list"
                defaultValue={[...this.list, null]}
                savable
                targetItem={{key: "module_id", item}}
                insertFn={insertNotificationSettings}
                deleteFn={deleteNotificationSettings}
                onAttrs={({user}) => ({
                    user_id: user.id,
                })}
                placeholder="Add User..."
                className="w-full margin-0"
            />
        </>;
    }
}

export default HRPermissionsCol;
