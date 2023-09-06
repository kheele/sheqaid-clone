/**
 * @generated SignedSource<<416f1f480f627ce3899f290015ce9990>>
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
    "name": "object"
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
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "ppe",
    "kind": "LinkedField",
    "name": "insert_ppe_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertPPEMutation",
    "selections": (v5/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPPEMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "a65d503564dacf55d9aad9d5df38d3ff",
    "id": null,
    "metadata": {},
    "name": "insertPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertPPEMutation(\n  $object: ppe_insert_input!\n) {\n  insert_ppe_one(object: $object) {\n    id\n    name\n    unit\n    qty_received\n    qty_issued\n    qty_in_stock\n    duration_type\n    duration_value\n    notes\n    profile_pic\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n    team_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    department_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    job_position_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9d60bb7668caabf677a0f31da5b1e995";

module.exports = node;
