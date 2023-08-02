/**
 * @generated SignedSource<<df94ca18808b9b89429dcf3a11574056>>
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
    "concreteType": "proxy_sector__training_matrix",
    "kind": "LinkedField",
    "name": "insert_proxy_sector__training_matrix_one",
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
    "name": "insertProxySectorTrainingMatrixMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxySectorTrainingMatrixMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a58638cace0da64914f14aebe7852f76",
    "id": null,
    "metadata": {},
    "name": "insertProxySectorTrainingMatrixMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxySectorTrainingMatrixMutation(\n  $object: proxy_sector__training_matrix_insert_input!\n) {\n  insert_proxy_sector__training_matrix_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "61d0fb1af348e3ac38e9e0095fc86e38";

module.exports = node;
