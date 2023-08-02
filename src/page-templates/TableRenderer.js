// <editor-fold defaultstate="collapsed" desc="RenderTable">
import {observer} from "mobx-react";
import React from "react";
import environment from "../EnvironmentReadable";
import {QueryRenderer} from "react-relay";
import OmniTable from "../components/Omni/OmniTable";

@observer
class TableRenderer extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.renderQueryRenderer = this.renderQueryRenderer.bind(this);
    }

    // </editor-fold>

    //<editor-fold desc="renderQueryRenderer">
    renderQueryRenderer({error, props}) {
        const {actions, columns, loader: {variables},} = this.props;
        const {permissionModKey, permissionOtherKey, override = false, readonly} = this.props;

        if (error) {
            return <div>{error.message}</div>;
        }
        if (props) {
            const key = Object.keys(props)[0];
            const connection = props[key];
            console.log('renderQueryRenderer connection', connection)
            const {
                pageInfo,
                edges = [],
            } = connection;
            const rows = edges.map(({node}) => {
                if (node.id) {
                    return {data: node, id: convertIdToBigint(node.id)};
                } else {
                    return node;
                }
            });
            console.log('renderQueryRenderer rows', rows)

            return (
                <OmniTable
                    key="OmniTable-Loaded"
                    actions={actions}
                    columns={columns}
                    rows={rows}
                    showTotalEntries={false}
                    canSearch={false}
                    entriesPerPage={false}
                    onClick={this.onClick}
                    onView={this.onView}
                    onEdit={this.onEdit}
                    onRemove={this.onRemove}
                    permissionModKey={permissionModKey}
                    permissionOtherKey={permissionOtherKey}
                    readonly={readonly}
                    override={override}
                    sx={{
                        margin: "10px 10px 0 0",
                        height: "calc(100% - 40px)"
                    }}
                />
            );
        }

        return <OmniTable
            key="OmniTable-Loading"
            actions={[]}
            columns={columns}
            rows={[]}
            showTotalEntries={false}
            canSearch={false}
            entriesPerPage={false}
            onView={this.onView}
            onEdit={this.onEdit}
            onRemove={this.onRemove}
            permissionModKey={permissionModKey}
            permissionOtherKey={permissionOtherKey}
            readonly={readonly}
            override={override}
            sx={{
                margin: "10px 10px 0 0",
                height: "calc(100% - 40px)"
            }}
        />;
    }
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {
            loader: {rows, query, variables},
            actions,
            columns,
            readonly,
            override,
            permissionModKey,
            permissionOtherKey,
            onClick,
            onView,
            onEdit,
            onRemove,
        } = this.props;

        if(query) {
            return <QueryRenderer environment={environment} query={query} variables={variables} render={this.renderQueryRenderer}/>;
        }

        if(rows) {
            return <OmniTable
                actions={actions}
                columns={columns}
                rows={rows}
                showTotalEntries={false}
                canSearch={false}
                entriesPerPage={false}
                onClick={onClick}
                onView={onView}
                onEdit={onEdit}
                onRemove={onRemove}
                permissionModKey={permissionModKey}
                permissionOtherKey={permissionOtherKey}
                readonly={readonly}
                override={override}
                sx={{
                    margin: "10px 10px 0 0",
                    height: "calc(100% - 40px)"
                }}
            />;
        }
    }
    //</editor-fold>
}

// </editor-fold>

export default TableRenderer;