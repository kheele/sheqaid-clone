/**
 * @generated SignedSource<<ee902759d53abeb153b929d01c94905c>>
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
    "alias": null,
    "args": [
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
    "concreteType": "proxy_job_category__training_matrixConnection",
    "kind": "LinkedField",
    "name": "proxy_job_category__training_matrix_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_job_category__training_matrixEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_job_category__training_matrix",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
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
    "name": "findByIdProxyJobCategoryTrainingMatrixQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdProxyJobCategoryTrainingMatrixQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fce41dd693489921bbcb8089d2b0eb73",
    "id": null,
    "metadata": {},
    "name": "findByIdProxyJobCategoryTrainingMatrixQuery",
    "operationKind": "query",
    "text": "query findByIdProxyJobCategoryTrainingMatrixQuery(\n  $id: bigint\n) {\n  proxy_job_category__training_matrix_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "2eae1a243cb6a556f2f6c98dcf2d74ab";

module.exports = node;
