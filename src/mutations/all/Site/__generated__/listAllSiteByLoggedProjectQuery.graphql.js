/**
 * @generated SignedSource<<825b040cd2197399c6de0973218589f0>>
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
    "name": "project_id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": {
          "name": "asc"
        }
      },
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "project_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "project_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_sitesConnection",
    "kind": "LinkedField",
    "name": "default_sites_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sitesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_sites",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "address",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_projects",
                "kind": "LinkedField",
                "name": "project",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_clients",
                "kind": "LinkedField",
                "name": "client",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractor_users_aggregate",
                "kind": "LinkedField",
                "name": "contractor_site_user_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_contractor_users_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_contractors__sites_aggregate",
                "kind": "LinkedField",
                "name": "contractor_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_contractors__sites_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  }
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllSiteByLoggedProjectQuery",
    "selections": (v5/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllSiteByLoggedProjectQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "2eec960baead324d6e0ee4cde94ad6d1",
    "id": null,
    "metadata": {},
    "name": "listAllSiteByLoggedProjectQuery",
    "operationKind": "query",
    "text": "query listAllSiteByLoggedProjectQuery(\n  $project_id: bigint\n) {\n  default_sites_connection(where: {project_id: {_eq: $project_id}}, order_by: {name: asc}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        address\n        project {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        contractor_site_user_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        contractor_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        user_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        employee_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        team_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        incident_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        training_matrix_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        asset_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "8c4534b1e275e94a53d4328bdefe7fad";

module.exports = node;
