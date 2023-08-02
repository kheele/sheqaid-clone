/**
 * @generated SignedSource<<0816e17fe8a93700db53b4262ac5e1e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "_set",
    "variableName": "_set"
  },
  {
    "kind": "Variable",
    "name": "pk_columns",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "contractor_email",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
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
  "concreteType": "default_contractors",
  "kind": "LinkedField",
  "name": "linked_contractor",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v5/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "username",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "desc",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "discount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "faIconLeft",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "faIconRight",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "has_update",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hover",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sort",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "svgIconLeft",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "svgIconRight",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v26 = [
  (v3/*: any*/),
  (v5/*: any*/)
],
v27 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_sector__client",
  "kind": "LinkedField",
  "name": "sector_list",
  "plural": true,
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_sectors",
      "kind": "LinkedField",
      "name": "sector",
      "plural": false,
      "selections": (v26/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site_list",
  "plural": true,
  "selections": (v26/*: any*/),
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project_list",
  "plural": true,
  "selections": [
    (v3/*: any*/),
    (v5/*: any*/),
    (v28/*: any*/)
  ],
  "storageKey": null
},
v30 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v31 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects_aggregate",
  "kind": "LinkedField",
  "name": "project_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "default_projects_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites_aggregate",
  "kind": "LinkedField",
  "name": "site_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "default_sites_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "concreteType": "default_contractors_aggregate",
  "kind": "LinkedField",
  "name": "contractor_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "default_contractors_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "default_users_aggregate",
  "kind": "LinkedField",
  "name": "user_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "default_users_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees_aggregate",
  "kind": "LinkedField",
  "name": "employee_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "hr_employees_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "concreteType": "default_teams_aggregate",
  "kind": "LinkedField",
  "name": "team_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "default_teams_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_incident_investigation_aggregate",
  "kind": "LinkedField",
  "name": "incident_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "sheq_incident_investigation_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_training_matrices_aggregate",
  "kind": "LinkedField",
  "name": "training_matrix_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "sheq_training_matrices_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "assets_aggregate",
  "kind": "LinkedField",
  "name": "asset_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "assets_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v30/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateClientMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "update_default_clients_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_plugin_module__company",
            "kind": "LinkedField",
            "name": "module_list",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_manager_module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v12/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_manager_plugin",
                    "kind": "LinkedField",
                    "name": "plugin",
                    "plural": false,
                    "selections": [
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v27/*: any*/),
          (v29/*: any*/),
          (v28/*: any*/),
          (v31/*: any*/),
          (v32/*: any*/),
          (v33/*: any*/),
          (v34/*: any*/),
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          (v38/*: any*/),
          (v39/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateClientMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "update_default_clients_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_plugin_module__company",
            "kind": "LinkedField",
            "name": "module_list",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_manager_module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v12/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_manager_plugin",
                    "kind": "LinkedField",
                    "name": "plugin",
                    "plural": false,
                    "selections": [
                      (v20/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v27/*: any*/),
          (v29/*: any*/),
          (v28/*: any*/),
          (v31/*: any*/),
          (v32/*: any*/),
          (v33/*: any*/),
          (v34/*: any*/),
          (v35/*: any*/),
          (v36/*: any*/),
          (v37/*: any*/),
          (v38/*: any*/),
          (v39/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "efb5a9bc5af9fc56163800b54237bfd8",
    "id": null,
    "metadata": {},
    "name": "updateClientMutation",
    "operationKind": "mutation",
    "text": "mutation updateClientMutation(\n  $id: default_clients_pk_columns_input!\n  $_set: default_clients_set_input!\n) {\n  update_default_clients_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    name\n    address\n    contractor_email\n    email\n    phone\n    profile_pic\n    linked_contractor {\n      id\n      name\n      username\n    }\n    module_list {\n      id\n      price\n      module {\n        id\n        borderColor\n        desc\n        discount\n        faIconLeft\n        faIconRight\n        has_update\n        hover\n        key\n        price\n        sort\n        status\n        svgIconLeft\n        svgIconRight\n        title\n        plugin {\n          key\n          id\n        }\n      }\n    }\n    sector_list {\n      id\n      sector {\n        id\n        name\n      }\n    }\n    project_list {\n      id\n      name\n      site_list {\n        id\n        name\n      }\n    }\n    site_list {\n      id\n      name\n    }\n    project_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    site_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    contractor_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    user_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    employee_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    team_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    incident_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    training_matrix_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    asset_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "4221c84e11f8cb499cd2a7d9a3b6ebb1";

module.exports = node;
