/**
 * @generated SignedSource<<eb0a68a36a37f64877f319becda4b2c0>>
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
    "concreteType": "coida_claims_annexture_1",
    "kind": "LinkedField",
    "name": "insert_coida_claims_annexture_1_one",
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
    "name": "insertAnnexture1Mutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAnnexture1Mutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "022674456274865ea289714e141b676e",
    "id": null,
    "metadata": {},
    "name": "insertAnnexture1Mutation",
    "operationKind": "mutation",
    "text": "mutation insertAnnexture1Mutation(\n  $object: coida_claims_annexture_1_insert_input!\n) {\n  insert_coida_claims_annexture_1_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "38f2d3cde23ffa57d16f62e706bca1a1";

module.exports = node;
