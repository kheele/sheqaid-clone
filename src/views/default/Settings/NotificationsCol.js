import {observer} from 'mobx-react';
import ACol from "./ACol";
import ARow from "./ARow";
import {NewUserListTable} from "../../../components/FormTableComponents";
import {insertNotificationSettings} from "../../../mutations/create";
import {deleteNotificationSettings} from "../../../mutations/delete";

@observer
class NotificationsCol extends ACol {

    title = "Notification Settings";
    sockets = sockets.of("notification-settings-categories");

    constructor(props) {
        super(props);
    }

    renderAccordionSummary(item, idx) {
        return `${item.text} Notifications`;
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
    listFn = sockets.of("notification-settings").fn('listByLogged');

    constructor(props) {
        super(props);
    }

    getArgs() {
        const {item: {key}} = this.props;

        return {key, exact_orgs: false, limit: 0,};
    }

    renderList() {
        const {item} = this.props;

        console.log(item);

        return <>
            <NewUserListTable
                name="list"
                defaultValue={[...this.list, null]}
                savable
                targetItem={{key: "notification_settings_id", item}}
                insertFn={insertNotificationSettings}
                deleteFn={deleteNotificationSettings}
                onAttrs={({user}) => ({
                    user_id: user.id,
                    key: item.key,
                })}
                placeholder="Add User..."
                className="w-full margin-0"
            />
        </>;
    }
}

export default NotificationsCol;
