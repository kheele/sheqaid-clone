import {mapIncidentPersonDetails} from "utils/ArrayMapperUtils";
import {toJS} from "mobx";

export default function onNext(e, btn) {
	const {form} = this;
	const {idx} = btn.props;
	if (idx === 3) {
		if (!form.isValid('category_list') || form.get('category_list').isEmpty()) {
			infoDialog.open('Incident Category is required');
			return;
		}
	}
	// if (idx === 6.1) {
	//     if (!form.isValid('person_involved_list') || form.get('person_involved_list').isEmpty()) {
	//         infoDialog.open('Person(s) Involved in the Incident are/is required');
	//         return;
	//     }
	// }
	if (idx === 6.2) {
		if (!form.isValid('person_reporting')) {
			infoDialog.open('Person Reporting the Incident is required');
			return;
		}
	}
	if (idx === 6.3) {
		if (!form.isValid('person_reported_to')) {
			infoDialog.open('Person Reported To is required');
			return;
		}
	}
	if (idx === 7.1) {
//            if (!form.isValid('person_injured')) {
//                infoDialog.open('Person Injured is required');
//                return;
//            }
//            if (!form.isValid('nature_of_injury_list') || form.get('nature_of_injury_list').isEmpty()) {
//                infoDialog.open('Nature Of Injury is required');
//                return;
//            }
//            if (!form.isValid('bodily_injury_location_list') || form.get('bodily_injury_location_list').isEmpty()) {
//                infoDialog.open('Bodily Injury Location (Part(s) Of Body Injured) is required');
//                return;
//            }
//            if (!form.isValid('injury_mechanism_list') || form.get('injury_mechanism_list').isEmpty()) {
//                infoDialog.open('Injury Mechanism (Direct Cause Of Injury) is required');
//                return;
//            }
	}
	if (idx === 7.2) {
		if (form.get('test_undertaken') === 'Yes') {
			//TODO: further validation is necessory
		}
	}

	return true;
};