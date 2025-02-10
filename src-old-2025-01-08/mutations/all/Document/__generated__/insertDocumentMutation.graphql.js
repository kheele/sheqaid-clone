/**
 * @generated SignedSource<<47c04416df6dac9dd2edb15cd770a2e3>>
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
    "concreteType": "sheq_documents",
    "kind": "LinkedField",
    "name": "insert_sheq_documents_one",
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
    "name": "insertDocumentMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertDocumentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ebae375f95902a64793d561bf6cdfd63",
    "id": null,
    "metadata": {},
    "name": "insertDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation insertDocumentMutation(\n  $object: sheq_documents_insert_input!\n) {\n  insert_sheq_documents_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cdad87a7c48b3e3f59563a6ac43ef2c4";

module.exports = node;
