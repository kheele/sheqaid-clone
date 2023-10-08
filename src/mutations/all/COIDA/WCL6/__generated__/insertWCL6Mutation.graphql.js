/**
 * @generated SignedSource<<fe07e9248e7a7618d5ed7f2719f340b5>>
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
    "concreteType": "coida_claims_wcl_6",
    "kind": "LinkedField",
    "name": "insert_coida_claims_wcl_6_one",
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
    "name": "insertWCL6Mutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertWCL6Mutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "26a0f1dd2727b1f686daec6142585678",
    "id": null,
    "metadata": {},
    "name": "insertWCL6Mutation",
    "operationKind": "mutation",
    "text": "mutation insertWCL6Mutation(\n  $object: coida_claims_wcl_6_insert_input!\n) {\n  insert_coida_claims_wcl_6_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "91ce3dea6eec74117284566807a40709";

module.exports = node;
