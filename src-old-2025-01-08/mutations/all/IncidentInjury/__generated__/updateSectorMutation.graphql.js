/**
 * @generated SignedSource<<382472979a7fc964d2791cf46ac7131a>>
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
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v5 = [
  (v2/*: any*/),
  (v3/*: any*/)
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
    "concreteType": "default_sectors",
    "kind": "LinkedField",
    "name": "update_default_sectors_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "desc",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sector_owner",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_sector__training_course_aggregate",
        "kind": "LinkedField",
        "name": "training_course_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_sector__training_course_aggregate_fields",
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
        "concreteType": "proxy_sector__company_aggregate",
        "kind": "LinkedField",
        "name": "company_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_sector__company_aggregate_fields",
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
        "concreteType": "proxy_sector__client_aggregate",
        "kind": "LinkedField",
        "name": "client_list_aggregate",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_sector__client_aggregate_fields",
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
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clients",
        "kind": "LinkedField",
        "name": "client",
        "plural": false,
        "selections": (v5/*: any*/),
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
    "name": "updateSectorMutation",
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
    "name": "updateSectorMutation",
    "selections": (v6/*: any*/)
  },
  "params": {
    "cacheID": "5b1823c4bb74b68f09eaea5f1de03f7e",
    "id": null,
    "metadata": {},
    "name": "updateSectorMutation",
    "operationKind": "mutation",
    "text": "mutation updateSectorMutation(\n  $id: default_sectors_pk_columns_input!\n  $_set: default_sectors_set_input!\n) {\n  update_default_sectors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    created_at\n    name\n    desc\n    sector_owner\n    training_course_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    company_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    client_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "3363dd2223c0501c0d57dee09b552006";

module.exports = node;
