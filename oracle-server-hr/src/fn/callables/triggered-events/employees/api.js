
// <editor-fold defaultstate="collapsed" desc="uploadProfileImageUpdate">
exports.uploadProfileImageUpdate = async (req) => {
	// await authorize();
	if (!req) {
		return;
	}

	const data = getTriggeredEventsData(body, "hr_employees");
	if (!data) {
		return;
	}

	const {new_item} = data;

	let {id, profile_pic,} = new_item;

	console.log('uploadProfileImageUpdate', new_item)

	const attrs = {};

	if (profile_pic && profile_pic.path) {
		const {path} = profile_pic;
		console.log('uploadProfileImageUpdate profile_pic', path)

		const new_name = `employees/${id}/profile_pic-${Dates.formatTimestamp(new Date())}`;
		attrs.profile_pic = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateRelay({
			mutation: `
		    mutation updateEmployeeProfileImageMutation($id: hr_employees_pk_columns_input!, $_set: hr_employees_set_input!) {
		      update_hr_employees_by_pk(pk_columns: $id, _set: $_set) {
		        id
		      }
		    }
		  `,
			operationName: "updateEmployeeProfileImageMutation",
			id,
			attrs,
		});

		const session = req.session;
		io.to(session.id).emit("insertEmployee", req.path);
	}
};
// </editor-fold>
