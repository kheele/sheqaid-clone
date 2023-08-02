/**
 * @generated SignedSource<<1199a558414a99c1061858e49e3d16f6>>
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
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v4 = [
  (v1/*: any*/),
  (v2/*: any*/)
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
    "concreteType": "default_sectors",
    "kind": "LinkedField",
    "name": "insert_default_sectors_one",
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
            "selections": (v3/*: any*/),
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
            "selections": (v3/*: any*/),
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
            "selections": (v3/*: any*/),
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
        "selections": (v4/*: any*/),
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
    "name": "insertSectorMutation",
    "selections": (v5/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSectorMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "0a44e3c07efeccda9204a2596563be65",
    "id": null,
    "metadata": {},
    "name": "insertSectorMutation",
    "operationKind": "mutation",
    "text": "mutation insertSectorMutation(\n  $object: default_sectors_insert_input!\n) {\n  insert_default_sectors_one(object: $object) {\n    id\n    created_at\n    name\n    desc\n    sector_owner\n    training_course_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    company_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    client_list_aggregate {\n      aggregate {\n        count\n      }\n    }\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "01034142aee6d4d9f71432e9f6f8f072";

module.exports = node;
