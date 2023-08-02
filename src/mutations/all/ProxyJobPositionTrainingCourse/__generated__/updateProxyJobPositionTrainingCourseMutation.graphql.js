/**
 * @generated SignedSource<<d0b8bf9afa8ac7d890340824f894670a>>
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
v2 = [
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
    "concreteType": "proxy_job_position__training_course",
    "kind": "LinkedField",
    "name": "update_proxy_job_position__training_course_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateProxyJobPositionTrainingCourseMutation",
    "selections": (v2/*: any*/),
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
    "name": "updateProxyJobPositionTrainingCourseMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "93212166da01d6dc83dd1aa42cf1fc05",
    "id": null,
    "metadata": {},
    "name": "updateProxyJobPositionTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyJobPositionTrainingCourseMutation(\n  $id: proxy_job_position__training_course_pk_columns_input!\n  $_set: proxy_job_position__training_course_set_input!\n) {\n  update_proxy_job_position__training_course_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "0b5507774dbf583bab27d69af7415f40";

module.exports = node;
