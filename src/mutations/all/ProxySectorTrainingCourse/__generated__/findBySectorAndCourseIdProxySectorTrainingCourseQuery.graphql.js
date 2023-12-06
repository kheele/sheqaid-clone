/**
 * @generated SignedSource<<5db86cdc03caacf26a3429e6a118d059>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "course_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sector_id"
},
v2 = [
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
                "variableName": "course_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "course_id"
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "sector_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "sector_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "proxy_sector__training_courseConnection",
    "kind": "LinkedField",
    "name": "proxy_sector__training_course_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_sector__training_courseEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_sector__training_course",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "findBySectorAndCourseIdProxySectorTrainingCourseQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "findBySectorAndCourseIdProxySectorTrainingCourseQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "710e911b544911b16338524aced09ebd",
    "id": null,
    "metadata": {},
    "name": "findBySectorAndCourseIdProxySectorTrainingCourseQuery",
    "operationKind": "query",
    "text": "query findBySectorAndCourseIdProxySectorTrainingCourseQuery(\n  $sector_id: bigint\n  $course_id: bigint\n) {\n  proxy_sector__training_course_connection(where: {sector_id: {_eq: $sector_id}, course_id: {_eq: $course_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "564442968f1a127ce986a7fe86918701";

module.exports = node;
