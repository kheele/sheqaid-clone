/**
 * @generated SignedSource<<bc94d142fe800376c7f8566c4eb42c38>>
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
  "name": "job_position_id"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v4 = [
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
                "variableName": "job_position_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "job_position_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "proxy_job_position__training_courseConnection",
    "kind": "LinkedField",
    "name": "proxy_job_position__training_course_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_job_position__training_courseEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_job_position__training_course",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_training_courses",
                "kind": "LinkedField",
                "name": "course",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_job_positions",
                "kind": "LinkedField",
                "name": "job_position",
                "plural": false,
                "selections": (v3/*: any*/),
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
    "name": "findByJobPositionAndCourseIdProxyJobPositionTrainingCourseQuery",
    "selections": (v4/*: any*/),
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
    "name": "findByJobPositionAndCourseIdProxyJobPositionTrainingCourseQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "51d741080a096d3a025a3f3cea36b256",
    "id": null,
    "metadata": {},
    "name": "findByJobPositionAndCourseIdProxyJobPositionTrainingCourseQuery",
    "operationKind": "query",
    "text": "query findByJobPositionAndCourseIdProxyJobPositionTrainingCourseQuery(\n  $job_position_id: bigint\n  $course_id: bigint\n) {\n  proxy_job_position__training_course_connection(where: {job_position_id: {_eq: $job_position_id}, course_id: {_eq: $course_id}}) {\n    edges {\n      node {\n        id\n        course {\n          id\n          name\n        }\n        job_position {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "665b3d5d3f685e7a2d80dacd89da44c6";

module.exports = node;
