import React from "react";
import {observer} from 'mobx-react';
import {Button} from "components/inputs";
import MKBox from "components/MK/MKBox";

@observer
class Comp extends React.Component {

    render() {
        const {onEdit, onCreate, list, type} = this.props;
        const {isEmployee} = storage.is;
        const sx = {};

        const noData = !list || list.isEmpty();
        if(noData) {
            sx.position = "absolute";
            sx.left = "0";
            sx.top = "0";
            sx.right = "0";
            sx.zIndex = "1";
        }
        return <MKBox sx={{
            background: "#fafafa",
            borderBottom: "1px solid #ddd",
            p: "10px",
            height: "50px",
            marginBottom: "-50px",
            ...sx,
        }}>
            {!isEmployee && !noData && <Button
                type={type}
                className="btn btn-primary pull-right btn-edit border-radius-20 padding-v-5 padding-h-15 margin-r-15"
                onClick={onEdit}>
                Edit
            </Button>}
            {!isEmployee && <Button
                type={type}
                className="btn btn-primary pull-right btn-create border-radius-20 padding-v-5 padding-h-15 margin-r-15"
                onClick={onCreate}>
                Create
            </Button>}
        </MKBox>;
    }
}

export default Comp;
