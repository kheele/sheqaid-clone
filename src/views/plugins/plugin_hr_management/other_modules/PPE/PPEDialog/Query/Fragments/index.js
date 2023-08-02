
//<editor-fold desc="ppe_details_fragment">
export const ppe_details_fragment = `
    id
    created_at
    name
    unit
    qty_received
    qty_issued
    qty_in_stock
    duration_type
    duration_value
    notes
    profile_pic
    
    team_list_aggregate{
      aggregate {
        count
      }
    }
    department_list_aggregate{
      aggregate {
        count
      }
    }
    job_position_list_aggregate{
      aggregate {
        count
      }
    }
`;
//</editor-fold>
