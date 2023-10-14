import {incident_corrective_actions_factors_fragment} from "../../../InvestigationsTab/Query/Fragments";

//<editor-fold desc="incident_investigation_cause_analysis_immediate_fragment">
export const incident_investigation_cause_analysis_immediate_fragment = `
  id
  sub_standard_practices_or_unsafe_acts #{text}
  sub_standard_practices_or_unsafe_conditions #{text}
  custom_sub_standard_practices_or_unsafe_acts #{text}
  custom_sub_standard_practices_or_unsafe_conditions #{text}
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_root_fragment">
export const incident_investigation_cause_analysis_root_fragment = `
  id
  custom_job_factors #{text}
  custom_personal_factors #{text}
  job_factors #{text}
  personal_factors #{text}
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_fragment">
export const incident_investigation_cause_analysis_fragment = `
  id
  immediate_analysis{
    ${incident_investigation_cause_analysis_immediate_fragment}
  }
  root_analysis{
    ${incident_investigation_cause_analysis_root_fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_corrective_actions_fragment">
export const incident_investigation_corrective_actions_fragment = `
  id
  custom_job_factors{
    ${incident_corrective_actions_factors_fragment}
  }
  custom_personal_factors{
    ${incident_corrective_actions_factors_fragment}
  }
  job_factors{
    ${incident_corrective_actions_factors_fragment}
  }
  personal_factors{
    ${incident_corrective_actions_factors_fragment}
  }
`;
//</editor-fold>
