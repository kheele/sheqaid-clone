
//<editor-fold desc="ncr_details_fragment">
export const ncr_details_fragment = `
      id
      created_at
      comments
      completed_date
      desc
      due_date
      process
      remarks
      type
      source
      priority
      allocation
      additional_notes
      status_acceptance
      status_progress
      result
      document_list(where: {type: {_eq: "Document Incident"}}){
        id
        doc
      }
      document_proof_list:document_list(where: {type: {_eq: "Document Proof"}}){
        id
        doc
      }
      progress_list{
        id
        outstanding
        notes
        date
      }
            responsible_party_list {
                id
                value
            }
            assigned_job_position_list {
                id
                job_position{
                    id
                    name 
                }
            }
            assigned_person_list {
                id
                employee{
                  id
	                fname
	                lname
	                full_name
	                email
	                phone
	                id_num
	                passport_num
                }
            }
      approving_person{
        id
        lname
        fname
        email
        phone
      }
      # responsible_person{
      #   id
      #   lname
      #   fname
      #   email
      #   phone
      # }
      selected_source_site {
        id
        name
        project{
            id 
            name
        }
        client{
            id 
            name
        }
      }
      selected_source_incident {
        id
      }
      selected_source_inspection {
        id
      }
      selected_source_compliance_audit {
        id
      }
`;
//</editor-fold>
