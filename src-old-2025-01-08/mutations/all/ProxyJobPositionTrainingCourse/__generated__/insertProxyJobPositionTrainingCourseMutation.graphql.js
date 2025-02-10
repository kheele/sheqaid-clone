/**
 * @generated SignedSource<<beda3a6c3ae650ce0e208dec9d094a8e>>
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
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_job_position__training_course",
    "kind": "LinkedField",
    "name": "insert_proxy_job_position__training_course_one",
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
    "name": "insertProxyJobPositionTrainingCourseMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyJobPositionTrainingCourseMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "1da966347adb1ceb3eacdc0681b76b3a",
    "id": null,
    "metadata": {},
    "name": "insertProxyJobPositionTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyJobPositionTrainingCourseMutation(\n  $object: proxy_job_position__training_course_insert_input!\n) {\n  insert_proxy_job_position__training_course_one(object: $object) {\n    id\n    course {\n      id\n      name\n    }\n    job_position {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b6cb6d8acfb0866c995163eeef22e9a5";

module.exports = node;
