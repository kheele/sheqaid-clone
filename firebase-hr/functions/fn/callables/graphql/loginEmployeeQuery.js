
exports.query = `
  query loginEmployeeQuery($auth_id: bigint) {
    hr_employees_connection(where: {auth_id: {_eq: $auth_id}}) {
      edges {
        node {
          created_at
          id
          auth_id
          auth_type
          has_biometric
          fname
          lname
          username
          phone
          profile_pic
          client_blacklist {
            client {
              id
              name
            }
          }
          notifications_settings {
            id
            receive_asset_management_notifs
            receive_chemicals_management_notifs
            receive_contractor_management_notifs
            receive_employees_expired_docs_medicals
            receive_employees_profile_notifs
            receive_incident_management_notifs
            receive_non_conformance_management_notifs
            receive_training_management_notifs
            receive_expired_docs_notifs
          }
          permissions_module_list {
            actions {
              create
              edit
              id
              remove
              share
              view
            }
            id
            module {
              key
              id
              manager_plugin {
                id
                key
                desc
                title
                status
              }
              title
            }
          }
          permissions_other_list {
            actions {
              create
              edit
              id
              remove
              share
              view
            }
            id
            key {
              key
              id
            }
          }
          site {
            id
            name
          }
          project {
            id
            name
          }
          client {
            id
            name
            profile_pic
          }
          company {
            consultant
            id
            name
            no_projects
            profile_pic
          }
        }
      }
    }
  }
`;
