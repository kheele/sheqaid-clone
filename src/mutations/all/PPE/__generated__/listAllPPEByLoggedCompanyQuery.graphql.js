/**
 * @generated SignedSource<<579414d50fc5deef6cc21f6e60cec0da>>
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
    "name": "company_id"
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
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "company_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "company_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "ppeConnection",
    "kind": "LinkedField",
    "name": "ppe_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ppeEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ppe",
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
                "name": "unit",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qty_received",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qty_issued",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qty_in_stock",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "duration_type",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "duration_value",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "notes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "profile_pic",
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
                "concreteType": "default_sites",
                "kind": "LinkedField",
                "name": "site",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_team__ppe_aggregate",
                "kind": "LinkedField",
                "name": "team_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_team__ppe_aggregate_fields",
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
                "concreteType": "proxy_department__ppe_aggregate",
                "kind": "LinkedField",
                "name": "department_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_department__ppe_aggregate_fields",
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
                "concreteType": "proxy_job_position__ppe_aggregate",
                "kind": "LinkedField",
                "name": "job_position_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_job_position__ppe_aggregate_fields",
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
    "name": "listAllPPEByLoggedCompanyQuery",
    "selections": (v5/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllPPEByLoggedCompanyQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "9522144de4907fb9ab61f7cb73e7df76",
    "id": null,
    "metadata": {},
    "name": "listAllPPEByLoggedCompanyQuery",
    "operationKind": "query",
    "text": "query listAllPPEByLoggedCompanyQuery(\n  $company_id: bigint\n) {\n  ppe_connection(where: {company_id: {_eq: $company_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        unit\n        qty_received\n        qty_issued\n        qty_in_stock\n        duration_type\n        duration_value\n        notes\n        profile_pic\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n        team_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        department_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        job_position_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "2cf6b941febb4a159ffc4d4cc6663fce";

module.exports = node;
