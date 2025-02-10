/**
 * @generated SignedSource<<de5f153eb5829dd47b060b1c38ee6d3c>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "proxy_job_position__training_course",
    "kind": "LinkedField",
    "name": "delete_proxy_job_position__training_course_by_pk",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_courses",
        "kind": "LinkedField",
        "name": "course",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_job_positions",
        "kind": "LinkedField",
        "name": "job_position",
        "plural": false,
        "selections": (v2/*: any*/),
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
    "name": "deleteProxyJobPositionTrainingCourseMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteProxyJobPositionTrainingCourseMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "2668e5fc42e223fca4a8ede1e10d14c9",
    "id": null,
    "metadata": {},
    "name": "deleteProxyJobPositionTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation deleteProxyJobPositionTrainingCourseMutation(\n  $id: bigint!\n) {\n  delete_proxy_job_position__training_course_by_pk(id: $id) {\n    id\n    course {\n      id\n      name\n    }\n    job_position {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f315ee753ee1a77b32bbda9070e7934a";

module.exports = node;
