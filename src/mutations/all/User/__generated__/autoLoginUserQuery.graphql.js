/**
 * @generated SignedSource<<305d97b9ea3fb5d6ddceb12c9195c348>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "auth_id"
  }
],
v1 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "_eq",
            "variableName": "auth_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "auth_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "auth_id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "full_name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profile_pic",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "auth_type",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_biometric",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_permissions_actions",
  "kind": "LinkedField",
  "name": "actions",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "create",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "edit",
      "storageKey": null
    },
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "remove",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "share",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "view",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "desc",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_permissions_modules",
  "kind": "LinkedField",
  "name": "permissions_module_list",
  "plural": true,
  "selections": [
    (v13/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_manager_module",
      "kind": "LinkedField",
      "name": "module",
      "plural": false,
      "selections": [
        (v14/*: any*/),
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "default_manager_plugin",
          "kind": "LinkedField",
          "name": "plugin",
          "plural": false,
          "selections": [
            (v2/*: any*/),
            (v14/*: any*/),
            (v15/*: any*/),
            (v16/*: any*/),
            (v17/*: any*/)
          ],
          "storageKey": null
        },
        (v16/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_permissions_other",
  "kind": "LinkedField",
  "name": "permissions_other_list",
  "plural": true,
  "selections": [
    (v13/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "sheq_permissions_other_keys",
      "kind": "LinkedField",
      "name": "key",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "value",
          "storageKey": null
        },
        (v2/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "notifications_settings",
  "kind": "LinkedField",
  "name": "notifications_settings",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_asset_management_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_chemicals_management_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_contractor_management_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_employees_expired_docs_medicals",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_employees_profile_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_incident_management_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_non_conformance_management_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_training_management_notifs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receive_expired_docs_notifs",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "linked_employee",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    (v21/*: any*/),
    (v9/*: any*/)
  ],
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "account_type",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "business_id",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "consultant",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "no_projects",
  "storageKey": null
},
v29 = [
  (v2/*: any*/),
  (v27/*: any*/)
],
v30 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_sector__company",
  "kind": "LinkedField",
  "name": "sector_list",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_sectors",
      "kind": "LinkedField",
      "name": "sector",
      "plural": false,
      "selections": (v29/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "discount",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "faIconLeft",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "faIconRight",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_update",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hover",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sort",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "svgIconLeft",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "svgIconRight",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "concreteType": "default_zones",
  "kind": "LinkedField",
  "name": "zone",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "concreteType": "default_countries",
  "kind": "LinkedField",
  "name": "country",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "default_company_categories",
  "kind": "LinkedField",
  "name": "category",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v29/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "autoLoginUserQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "default_usersConnection",
        "kind": "LinkedField",
        "name": "default_users_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_usersEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "default_users",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_companies",
                    "kind": "LinkedField",
                    "name": "company",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v23/*: any*/),
                      (v24/*: any*/),
                      (v25/*: any*/),
                      (v26/*: any*/),
                      (v21/*: any*/),
                      (v27/*: any*/),
                      (v28/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v30/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "proxy_plugin_module__company",
                        "kind": "LinkedField",
                        "name": "module_list",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          (v31/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_manager_module",
                            "kind": "LinkedField",
                            "name": "module",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              (v32/*: any*/),
                              (v15/*: any*/),
                              (v33/*: any*/),
                              (v34/*: any*/),
                              (v35/*: any*/),
                              (v36/*: any*/),
                              (v37/*: any*/),
                              (v14/*: any*/),
                              (v31/*: any*/),
                              (v38/*: any*/),
                              (v17/*: any*/),
                              (v39/*: any*/),
                              (v40/*: any*/),
                              (v16/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "default_manager_plugin",
                                "kind": "LinkedField",
                                "name": "plugin",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v43/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "autoLoginUserQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "default_usersConnection",
        "kind": "LinkedField",
        "name": "default_users_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_usersEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "default_users",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_companies",
                    "kind": "LinkedField",
                    "name": "company",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v23/*: any*/),
                      (v24/*: any*/),
                      (v25/*: any*/),
                      (v26/*: any*/),
                      (v21/*: any*/),
                      (v27/*: any*/),
                      (v28/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v30/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "proxy_plugin_module__company",
                        "kind": "LinkedField",
                        "name": "module_list",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          (v31/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "default_manager_module",
                            "kind": "LinkedField",
                            "name": "module",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              (v32/*: any*/),
                              (v15/*: any*/),
                              (v33/*: any*/),
                              (v34/*: any*/),
                              (v35/*: any*/),
                              (v36/*: any*/),
                              (v37/*: any*/),
                              (v14/*: any*/),
                              (v31/*: any*/),
                              (v38/*: any*/),
                              (v17/*: any*/),
                              (v39/*: any*/),
                              (v40/*: any*/),
                              (v16/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "default_manager_plugin",
                                "kind": "LinkedField",
                                "name": "plugin",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/),
                                  (v2/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v41/*: any*/),
                      (v42/*: any*/),
                      (v43/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v44/*: any*/),
                  (v45/*: any*/),
                  (v46/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "88600c5acd10fdfced8e922842795b3f",
    "id": null,
    "metadata": {},
    "name": "autoLoginUserQuery",
    "operationKind": "query",
    "text": "query autoLoginUserQuery(\n  $auth_id: String\n) {\n  default_users_connection(where: {auth_id: {_eq: $auth_id}}) {\n    edges {\n      node {\n        id\n        auth_id\n        created_at\n        fname\n        lname\n        full_name\n        username\n        phone\n        profile_pic\n        auth_type\n        has_biometric\n        permissions_module_list {\n          actions {\n            create\n            edit\n            id\n            remove\n            share\n            view\n          }\n          id\n          module {\n            key\n            id\n            plugin {\n              id\n              key\n              desc\n              title\n              status\n            }\n            title\n          }\n        }\n        permissions_other_list {\n          actions {\n            create\n            edit\n            id\n            remove\n            share\n            view\n          }\n          id\n          key {\n            value\n            id\n          }\n        }\n        notifications_settings {\n          id\n          receive_asset_management_notifs\n          receive_chemicals_management_notifs\n          receive_contractor_management_notifs\n          receive_employees_expired_docs_medicals\n          receive_employees_profile_notifs\n          receive_incident_management_notifs\n          receive_non_conformance_management_notifs\n          receive_training_management_notifs\n          receive_expired_docs_notifs\n        }\n        linked_employee {\n          id\n          fname\n          lname\n          email\n          phone\n        }\n        company {\n          id\n          created_at\n          account_type\n          address\n          business_id\n          consultant\n          email\n          name\n          no_projects\n          phone\n          profile_pic\n          sector_list {\n            id\n            sector {\n              id\n              name\n            }\n          }\n          module_list {\n            id\n            price\n            module {\n              id\n              borderColor\n              desc\n              discount\n              faIconLeft\n              faIconRight\n              has_update\n              hover\n              key\n              price\n              sort\n              status\n              svgIconLeft\n              svgIconRight\n              title\n              plugin {\n                key\n                id\n              }\n            }\n          }\n          zone {\n            id\n            name\n          }\n          country {\n            id\n            name\n          }\n          category {\n            id\n            name\n          }\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "778a8a9a44e56aeb9b811a468b19db02";

module.exports = node;
