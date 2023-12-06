/**
 * @generated SignedSource<<e3a5da4957c2318a7b507856d4bf2e21>>
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
    "concreteType": "proxy_sector__training_course",
    "kind": "LinkedField",
    "name": "delete_proxy_sector__training_course_by_pk",
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
        "concreteType": "default_sectors",
        "kind": "LinkedField",
        "name": "sector",
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
    "name": "deleteProxySectorTrainingCourseMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteProxySectorTrainingCourseMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "ea5596f2099b7e70b8c95a00d7e046b7",
    "id": null,
    "metadata": {},
    "name": "deleteProxySectorTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation deleteProxySectorTrainingCourseMutation(\n  $id: bigint!\n) {\n  delete_proxy_sector__training_course_by_pk(id: $id) {\n    id\n    course {\n      id\n      name\n    }\n    sector {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6efb9c8882d15f97cf703b9c554a4d9f";

module.exports = node;
