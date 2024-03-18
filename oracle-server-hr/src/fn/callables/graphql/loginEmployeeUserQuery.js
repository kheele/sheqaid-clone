
exports.query = `
  query loginEmployeeUserQuery($auth_id: String) {
    hr_employees_connection(where: {auth_id: {_eq: $auth_id}}) {
      edges {
        node {
          id
          auth_id
          created_at
          fname
          lname
          full_name
          email
          phone
          profile_pic
          linked_user_id
          linked_user {
            id
            fname
            lname
            username
            phone
          }
          linked_contractor_user_id
          linked_contractor_user {
            id
            fname
            lname
            username
            phone
          }
          supervisor_id
          supervisor {
            id
            fname
            lname
            email
            phone
          }
          job_position_id
          job_position{
            id
            name
          }
          department_id
          department{
            id
            name
          }
          team_id
          team {
            id
            name
          }
          contractor{
            id
            name
          }
          contractor_client{
            id
            name
          }
          contractor_site{
            id
            name
          }
          company {
              id
              created_at
              account_type
              address
              business_id
              consultant
              email
              name
              no_projects
              phone
              profile_pic
              sector_list {
                id
                sector {
                  id
                  name
                }
              }
              module_list {
                id
                price
                module {
                  id
                  borderColor
                  desc
                  discount
                  faIconLeft
                  faIconRight
                  has_update
                  hover
                  key
                  price
                  sort
                  status
                  svgIconLeft
                  svgIconRight
                  title
                  plugin{
                    key
                  }
                }
              }
              city {
                id
                name
              }
              zone {
                id
                name
              }
              country {
                id
                name
              }
              category {
                id
                name
              }
          }
          client {
            id
            name
            project_list{
              id
              name
              site_list{
	              id
	              name
	            }
            }
            site_list{
              id
              name
            }
            module_list {
                id
                price
                module {
                  id
                  borderColor
                  desc
                  discount
                  faIconLeft
                  faIconRight
                  has_update
                  hover
                  key
                  price
                  sort
                  status
                  svgIconLeft
                  svgIconRight
                  title
                  plugin{
                    key
                  }
                }
            }
          }
          project {
            id
            name
            site_list{
              id
              name
            }
          }
          site {
            id
            name
          }
        }
      }
    }
  }
`;
