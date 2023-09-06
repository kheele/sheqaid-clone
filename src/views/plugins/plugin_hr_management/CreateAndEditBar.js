import React from "react";
import {observer} from 'mobx-react';
import {Button} from "components/inputs";
import MKBox from "components/MK/MKBox";
import {computed} from "mobx";

@observer
class Comp extends React.Component {

	render() {
		const {onRemove, onEdit, onCreate, list: _list, type, isEmbedded} = this.props;
		const {isEmployee} = storage.is;
		const sx = {};

		const list = (_list || []).filter(v => !!v);
		if (list.isEmpty()) {
			sx.position = "absolute";
			sx.left = "0";
			sx.top = "0";
			sx.right = "0";
			sx.zIndex = "1";
		}
		return <MKBox
			className={isEmbedded ? 'EmbeddedBtnBar' : ''}
			sx={{
				background: "#fafafa",
				borderBottom: "1px solid #ddd",
				p: "3px",
				height: "40px",
				marginBottom: "-40px",
				...sx,
			}}>
			{!isEmployee && list.isNotEmpty() && <Button
				type={type}
				className="btn btn-primary pull-right btn-remove border-radius-20 padding-v-5 padding-h-15 margin-r-15"
				onClick={onRemove}>
				Remove
			</Button>}
			{!isEmployee && list.isNotEmpty() && <Button
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
