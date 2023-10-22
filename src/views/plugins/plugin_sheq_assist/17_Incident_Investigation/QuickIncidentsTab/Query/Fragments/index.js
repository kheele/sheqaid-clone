import {employee_personal_details_fragment, orgs_id_fragment, personal_details_other_fragment} from "graphql/Fragments";

//<editor-fold desc="incident_details_fragment">
export const incident_details_fragment = `
  id
  exact_location
  short_desc
  incident_date
  incident_time
  date_reported
  time_reported
  time_shift
  person_reporting{
    ${employee_personal_details_fragment}
  }
  person_reporting_other{
    ${personal_details_other_fragment}
  }
  person_injured{
    ${employee_personal_details_fragment}
  }
  person_injured_other{
    ${personal_details_other_fragment}
  }
  driver{
      ${employee_personal_details_fragment}
   }
   driver_other{
      ${personal_details_other_fragment}
   }
  driver_phone
  vehicle_make
  vehicle_reg_num
  severity{
    id
    consequence
    likelihood
    risk_rating
    risk_rating_score
  }
  company{
    ${orgs_id_fragment}
  }
  latitude
  longitude
  logged_user{
    ${user_personal_details_fragment}
  }
  logged_employee{
    ${employee_personal_details_fragment}
  }
  driver_email
  
  
  sector_list{
    id
    sector{
      id
      name
    }
  }
  contractor_site{
    id
    name
  }
  contractor {
    id
    name
  }
`;
//</editor-fold>
