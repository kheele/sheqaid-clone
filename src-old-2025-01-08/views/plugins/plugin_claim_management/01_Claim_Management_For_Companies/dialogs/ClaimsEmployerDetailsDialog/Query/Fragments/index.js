
//<editor-fold desc="coida_claims_employer_details_fragment">
export const coida_claims_employer_details_fragment = `
    id
    created_at
    
    company_name
    company_reg_num
    company_str_addr
    company_str_addr_code
    company_postal_addr
    company_postal_addr_code
    company_tel_code
    company_tel_num
    company_fax_code
    company_fax_num
    company_email
    company_location
    company_nature
    
    company_contact_person{
      id
      fname
      lname
      full_name
    }
    company_contact_person_other{
      id
      fname
      lname
      full_name
    }
    
    company{
      id
      name
    }
    client{
      id
      name
    }
    user{
      id
    }
`;
//</editor-fold>
