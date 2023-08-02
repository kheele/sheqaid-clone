/**
 * @generated SignedSource<<ef85333e9c9dd52fc1d2229a25bb263a>>
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
    "name": "client_id"
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
                "variableName": "client_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "client_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_job_categoriesConnection",
    "kind": "LinkedField",
    "name": "default_job_categories_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_job_categoriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_job_categories",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_job_positions",
                "kind": "LinkedField",
                "name": "job_position_list",
                "plural": true,
                "selections": [
                  (v1/*: any*/),
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listForSelectionJobCategoryByLoggedClientQuery",
    "selections": (v3/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listForSelectionJobCategoryByLoggedClientQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "bd7c5f810a1faa61afada6d42ae4b531",
    "id": null,
    "metadata": {},
    "name": "listForSelectionJobCategoryByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listForSelectionJobCategoryByLoggedClientQuery(\n  $client_id: bigint\n) {\n  default_job_categories_connection(where: {client_id: {_eq: $client_id}}, order_by: {name: asc}) {\n    edges {\n      node {\n        id\n        name\n        job_position_list {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "0946039dd2b78b03ff45cb0f4ceb56eb";

module.exports = node;
