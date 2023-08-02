/**
 * @generated SignedSource<<c1945f1dcdb4a3a6fcfaae246279c8b9>>
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
    "concreteType": "proxy_sector__training_course",
    "kind": "LinkedField",
    "name": "insert_proxy_sector__training_course_one",
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
    "name": "insertProxySectorTrainingCourseMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxySectorTrainingCourseMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "efe7f0a348803e31c2a1ab6d9a3ab8e9",
    "id": null,
    "metadata": {},
    "name": "insertProxySectorTrainingCourseMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxySectorTrainingCourseMutation(\n  $object: proxy_sector__training_course_insert_input!\n) {\n  insert_proxy_sector__training_course_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d04000dfabba5b27a1134c12678d6598";

module.exports = node;
