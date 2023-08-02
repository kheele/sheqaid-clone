/**
 * @generated SignedSource<<4f6835c9a6684c9801566c4a9a7721ca>>
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
    "concreteType": "proxy_job_position__training_matrixConnection",
    "kind": "LinkedField",
    "name": "proxy_job_position__training_matrix_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_job_position__training_matrixEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_job_position__training_matrix",
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
    "name": "findByIdProxyJobPositionTrainingMatrixQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdProxyJobPositionTrainingMatrixQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ab93753dcabb76d3129e8ed024fd12b6",
    "id": null,
    "metadata": {},
    "name": "findByIdProxyJobPositionTrainingMatrixQuery",
    "operationKind": "query",
    "text": "query findByIdProxyJobPositionTrainingMatrixQuery(\n  $id: bigint\n) {\n  proxy_job_position__training_matrix_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6cbf4d00a66683737a04669d37d23733";

module.exports = node;
