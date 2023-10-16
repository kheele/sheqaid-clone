import {
    incident_corrective_actions_factors_fragment,
} from "../../../InvestigationsTab/Query/Fragments";

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
