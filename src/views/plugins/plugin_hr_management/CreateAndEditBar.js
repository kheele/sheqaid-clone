import React from "react";
import {observer} from 'mobx-react';
import {Button} from "components/inputs";
import MKBox from "components/MK/MKBox";
import {execWhen} from "utils/Utils";

@observer
class Comp extends React.Component {

	hideEditableButtons() {
		execWhen(() => this.refs.editB).then(ref => {
			ref.hide();
		});
		execWhen(() => this.refs.removeB).then(ref => {
			ref.hide();
		});
	}

	showEditableButtons() {
		execWhen(() => this.refs.editB).then(ref => {
			ref.show();
		});
		execWhen(() => this.refs.removeB).then(ref => {
			ref.show();
		});
	}

	render() {
		const {onRemove, onEdit, onCreate, list: _list, type, isEmbedded, isContained} = this.props;
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

		const node = <>
			{!isEmployee && list.isNotEmpty() && <Button
				ref="removeB"
				type={type}
				className="btn btn-primary pull-right btn-remove border-radius-20 padding-v-5 padding-h-15 margin-r-15"
				onClick={onRemove}>
				Remove
			</Button>}
			{!isEmployee && list.isNotEmpty() && <Button
				ref="editB"
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
		</>;

		if(isContained) {
			return node;
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
			{node}
		</MKBox>;
	}
}

export default Comp;
