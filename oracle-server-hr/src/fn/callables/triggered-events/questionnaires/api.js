const updateQuestion = require('../../queries/updateQuestion');
const updateQuestionOption = require('../../queries/updateQuestionOption');
const {mutation: insertQuestionnaireScheduleMutation} = require("../../graphql/insertQuestionnaireScheduleMutation");

// <editor-fold defaultstate="collapsed" desc="uploadQuestionnaireFilesUpdate">
exports.uploadQuestionnaireFilesUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//default_contractor_questionnaires_ques
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "default_contractor_questionnaires_ques" || !new_item) {
		return;
	}

	let {id, ques_id, questionnaire_id, isMultiAnswer, answer, questionImage, questionType} = new_item;

	console.log('uploadQuestionnaireFilesNew', new_item)

	const attrs = {};

	if (questionImage && questionImage.path) {
		const {path} = questionImage;
		console.log('uploadQuestionnaireFilesNew questionImage', path)

		const new_name = `questionnaires/${questionnaire_id}/${ques_id}/${id}/questionImage`;
		attrs.questionImage = await uploadDataUri(path, new_name);
	}

	if (answer && answer.path) {
		const {path} = answer;
		console.log('uploadQuestionnaireFilesNew answer', path)

		const new_name = `questionnaires/${questionnaire_id}/${ques_id}/${id}/answer`;
		attrs.answer = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateQuestion({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadQuestionOptionFilesUpdate">
exports.uploadQuestionOptionFilesUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//default_contractor_questionnaires_ques_options
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "default_contractor_questionnaires_ques_options" || !new_item) {
		return;
	}

	let {id, ques_id, answer, optionImage, optionType} = new_item;

	console.log('uploadQuestionOptionFilesNew', new_item)

	const attrs = {};

	if (optionImage && optionImage.path) {
		const {path} = optionImage;
		console.log('uploadQuestionOptionFilesNew optionImage', path)

		const new_name = `questionnaires/questions/${ques_id}/${id}/optionImage`;
		attrs.optionImage = await uploadDataUri(path, new_name);
	}

	if (answer && answer.path) {
		const {path} = answer;
		console.log('uploadQuestionOptionFilesNew answer', path)

		const new_name = `questionnaires/questions/${ques_id}/${id}/answer`;
		attrs.answer = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateQuestionOption({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="createScheduleQuestionnaireUpdate">
exports.createScheduleQuestionnaireUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//default_contractor_questionnaires
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "default_contractor_questionnaires" || !new_item) {
		return;
	}

	let {id, interval, start_date, time} = new_item;

	console.log('createScheduleQuestionnaireNew', new_item)

	if (interval && start_date && time) {
		const year = new Date().getFullYear();
		const dates = createDateList(interval, year, Dates.parse(start_date));
		for (let n = 0; n < dates.length; n++) {
			const date = dates[n];
			await insertRelay({
				query: insertQuestionnaireScheduleMutation,
				operationName: 'insertQuestionnaireScheduleMutation',
				input: {
					questionnaire_id: id,
					date,
					time,
					interval,

					// completed,
					// date_completed,
					// time_completed
				},
			});
		}

		console.log('createScheduleQuestionnaireNew interval && start_date && time', interval, start_date, time)
	}
};
// </editor-fold>

function createDateList(interval, year, startDate) {
	const dates = [];

	let start = new Date(year, startDate.getMonth(), startDate.getDate());

	let n;

	if (interval === 'Daily' || interval === 'Weekly') {
		const end = new Date(year + 1, 0, 0);
		if (interval === 'Daily') {
			n = 1;
		} else if (interval === 'Weekly') {
			n = 7;
		}
		while (start <= end) {
			dates.push(start);
			start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);
		}
	} else {
		const end = new Date(year + 6, 0, 0);
		if (interval === 'Annually') {
			n = 1;
			while (start <= end) {
				dates.push(start);
				start = new Date(start.getFullYear() + n, start.getMonth(), start.getDate());
			}
		} else {
			if (interval === 'Monthly') {
				n = 1;
			} else if (interval === 'Quarterly') {
				n = 3;
			} else if (interval === 'Bi-Annually') {
				n = 6;
			}
			while (start <= end) {
				dates.push(start);
				start = new Date(start.getFullYear(), start.getMonth() + n, start.getDate());
			}
		}
	}

	return dates;
}