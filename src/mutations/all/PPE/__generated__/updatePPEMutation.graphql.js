/**
 * @generated SignedSource<<be2999b74f584e04ba370dededd332f1>>
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
  "name": "name",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v6 = [
  {
    "alias": null,
    "args": [
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
    "concreteType": "ppe",
    "kind": "LinkedField",
    "name": "update_ppe_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      (v3/*: any*/),
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
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_projects",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "site",
        "plural": false,
        "selections": (v4/*: any*/),
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
            "selections": (v5/*: any*/),
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
            "selections": (v5/*: any*/),
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
            "selections": (v5/*: any*/),
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updatePPEMutation",
    "selections": (v6/*: any*/),
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
    "name": "updatePPEMutation",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "286a45e0788f92941977541d747cce4b",
    "id": null,
    "metadata": {},
    "name": "updatePPEMutation",
    "operationKind": "mutation",
    "text": "mutation updatePPEMutation(\n  $id: ppe_pk_columns_input!\n  $_set: ppe_set_input!\n) {\n  update_ppe_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    name\n    unit\n    qty_received\n    qty_issued\n    qty_in_stock\n    duration_type\n    duration_value\n    notes\n    profile_pic\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    site {\n      id\n      name\n    }\n    team_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    department_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    job_position_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "eb54c8f181deeeb3a447d1d593ee0b9a";

module.exports = node;
