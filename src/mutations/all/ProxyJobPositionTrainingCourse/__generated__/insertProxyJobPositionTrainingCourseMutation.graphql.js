/**
 * @generated SignedSource<<ccac8c094f3888bdceb450f2b5cddb01>>
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_job_position__training_course",
    "kind": "LinkedField",
    "name": "insert_proxy_job_position__training_course_one",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertProxyJobPositionTrainingCourseMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyJobPositionTrainingCourseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8a85eed1002d15a90d0457c7ef9b28e3",
    "id": null,
    "metadata": {},
    "name": "insertProxyJobPositionTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyJobPositionTrainingCourseMutation(\n  $object: proxy_job_position__training_course_insert_input!\n) {\n  insert_proxy_job_position__training_course_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "94044fe951329694bbe921b1f8f92797";

module.exports = node;
