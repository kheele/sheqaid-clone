/**
 * @generated SignedSource<<55678b2098e9bdf589cd941e46eac3a2>>
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
    "name": "id"
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
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "id"
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
  "name": "created_at",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
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
v10 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "supervisor",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v6/*: any*/),
    (v7/*: any*/),
    (v8/*: any*/),
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "default_job_positions",
      "kind": "LinkedField",
      "name": "job_position",
      "plural": false,
      "selections": (v10/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "default_sites",
  "kind": "LinkedField",
  "name": "site",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v15 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v16 = {
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
      "selections": (v15/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "proxy_team__ppe_aggregate",
  "kind": "LinkedField",
  "name": "ppe_list_aggregate",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "proxy_team__ppe_aggregate_fields",
      "kind": "LinkedField",
      "name": "aggregate",
      "plural": false,
      "selections": (v15/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "hr_employees",
  "kind": "LinkedField",
  "name": "employee_list",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v6/*: any*/),
    (v7/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "full_name",
      "storageKey": null
    },
    (v8/*: any*/),
    (v9/*: any*/)
  ],
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "profile_pic",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "findByIdTeamQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "default_teamsConnection",
        "kind": "LinkedField",
        "name": "default_teams_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_teamsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "default_teams",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_team__ppe",
                    "kind": "LinkedField",
                    "name": "ppe_list",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ppe",
                        "kind": "LinkedField",
                        "name": "ppe",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v19/*: any*/)
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
    "name": "findByIdTeamQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "default_teamsConnection",
        "kind": "LinkedField",
        "name": "default_teams_connection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_teamsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "default_teams",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "proxy_team__ppe",
                    "kind": "LinkedField",
                    "name": "ppe_list",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ppe",
                        "kind": "LinkedField",
                        "name": "ppe",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v19/*: any*/),
                          (v2/*: any*/)
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "531d7911b34afa2f7e30f98bae2562f4",
    "id": null,
    "metadata": {},
    "name": "findByIdTeamQuery",
    "operationKind": "query",
    "text": "query findByIdTeamQuery(\n  $id: bigint\n) {\n  default_teams_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        status\n        supervisor {\n          id\n          fname\n          lname\n          email\n          phone\n          job_position {\n            id\n            name\n          }\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        site {\n          id\n          name\n        }\n        employee_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        ppe_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        employee_list {\n          id\n          fname\n          lname\n          full_name\n          email\n          phone\n        }\n        ppe_list {\n          id\n          ppe {\n            name\n            profile_pic\n            id\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "1b369cdc037590e363860db54d6ee3a2";

module.exports = node;
