
//<editor-fold desc="coida_claims_fragment">
export const coida_claims_fragment = `
    id
    created_at
    
    claim_number
    provincial_office
    accident_date
    doctor_email_1
    
    employee{
      id
      full_name
    }
    
    message_list_provider{
      id
      date
      msg
      read
      sender{
        id
        full_name
        fname
        lname
        username
      }
    }
    
    wcl_2{
      id
    }
    wcl_4{
      id
    }
    wcl_5_list{
      id
    }
    wcl_6{
      id
    }
    annexture_1{
      id
    }
    
    client {
      id
      name
    }
    project {
      id
      name
    }
    site {
      id
      name
    }
`;
//</editor-fold>
