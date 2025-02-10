/**
 * @generated SignedSource<<201ab7042cc0901ecdc18f3e900f354d>>
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
    "concreteType": "proxy_sector__training_course",
    "kind": "LinkedField",
    "name": "insert_proxy_sector__training_course_one",
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
    "name": "insertProxySectorTrainingCourseMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxySectorTrainingCourseMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "709d641d5832cdb1d6c24282ab3260c1",
    "id": null,
    "metadata": {},
    "name": "insertProxySectorTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxySectorTrainingCourseMutation(\n  $object: proxy_sector__training_course_insert_input!\n) {\n  insert_proxy_sector__training_course_one(object: $object) {\n    id\n    course {\n      id\n      name\n    }\n    sector {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "88afefec6db6b5d2bfe2e82dbef72a94";

module.exports = node;
