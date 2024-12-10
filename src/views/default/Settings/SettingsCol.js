import {observer} from 'mobx-react';
import ACol from "./ACol";
import ARow from "./ARow";
import {insertSettings} from "mutations/create";
import {deleteSettings} from "mutations/delete";
import {NewUserListTable} from "../../../components/FormTableComponents";

@observer
class SettingsCol extends ACol {

    title = "General Settings";
    sockets = sockets.of("settings-categories");

    constructor(props) {
        super(props);
    }

    renderAccordionSummary(item, idx) {
        return `${item.data.key}`;
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
    listFn = sockets.of("settings").fn('listByLogged');

    constructor(props) {
        super(props);
    }

    getArgs() {
        const {item: {id: settings_category_id, data}} = this.props;

        return {settings_category_id, exact_orgs: false, limit: 0,};
    }

    renderList() {
        const {item} = this.props;

        return <>
            <NewUserListTable
                name="list"
                defaultValue={[...this.list.map(v => v.data.settings_user), null]}
                savable
                targetItem={{key: "settings_category_id", item}}
                insertFn={insertSettings}
                deleteFn={deleteSettings}
                onAttrs={({user}) => ({
                    settings_user_id: user.id,
                })}
                placeholder="Add User..."
                className="w-full margin-0"
            />
        </>;
    }
}

export default SettingsCol;
