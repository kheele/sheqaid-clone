// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Button} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {ViewCertificatesTab} from '../../Competencies';
import {
	CertificateAccredited,
	CertificateNonAccredited
} from 'views/plugins/plugin_sheq_assist/05_Training/dialogs/CertificateComponents';
import {
	EmployeeTrainingMatrixTable,
	EmployeeTrainingPlanTable,
	EmployeeTrainingRegisterTable
} from 'views/plugins/plugin_sheq_assist/05_Training/dialogs/ComponentsEmployeeTraining';
import NewTrainingPlanForEmployeeDialog
	from 'views/plugins/plugin_sheq_assist/05_Training/dialogs/NewTrainingPlanForEmployeeDialog';
import NextOfKinSection from "./NextOfKinSection";
import DependantSection from "./DependantSection";
import TrainingCourseSection from "./TrainingCourseSection";
import TrainingPlanSection from "./TrainingPlanSection";
import TrainingMatrixSection from "./TrainingMatrixSection";
import TrainingRegisterSection from "./TrainingRegisterSection";

// </editor-fold>

@observer
class JobObservationsSection extends React.Component {
	pageKey = "JobObservationsSection";

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
	}

	// </editor-fold>

	render() {
		const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;

		const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
		return <div id={this.pageKey + "-tab"} className={className}>
			<FormControls lazyLoad>
				<Row
					rendered
					idx={idx + ".1"}
					title={idx + ".1 Observation Templates"}
					sectionClassName="h-380 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormNext={onFormNext}
				>
					<TrainingCourseSection item={item}/>
				</Row>
				<Row
					rendered
					idx={idx + ".2"}
					title={idx + ".2 Observations Conducted"}
					sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
					onFormOpen={onFormOpen}
					onFormBack={onFormBack}
				>
					<TrainingPlanSection item={item}/>
				</Row>
			</FormControls>
		</div>;
	}
}

export default JobObservationsSection;