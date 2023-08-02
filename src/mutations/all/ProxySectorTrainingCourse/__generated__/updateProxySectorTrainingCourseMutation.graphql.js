/**
 * @generated SignedSource<<926766781ea7eeb66a5a942372f05054>>
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
    "concreteType": "proxy_sector__training_course",
    "kind": "LinkedField",
    "name": "update_proxy_sector__training_course_by_pk",
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
    "name": "updateProxySectorTrainingCourseMutation",
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
    "name": "updateProxySectorTrainingCourseMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e09d667b46f8e839791f581beb6b31a1",
    "id": null,
    "metadata": {},
    "name": "updateProxySectorTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxySectorTrainingCourseMutation(\n  $id: proxy_sector__training_course_pk_columns_input!\n  $_set: proxy_sector__training_course_set_input!\n) {\n  update_proxy_sector__training_course_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d8d5b4e5b6e01fc6599e1a03e420c813";

module.exports = node;
