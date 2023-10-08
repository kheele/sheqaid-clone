/**
 * @generated SignedSource<<06fc1bd93f7930e78c4761c1f27ce9f0>>
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
    "concreteType": "coida_claims_wcl_5",
    "kind": "LinkedField",
    "name": "insert_coida_claims_wcl_5_one",
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
    "name": "insertWCL5Mutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertWCL5Mutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "72d386e06af88f37e0a0a23881e56e57",
    "id": null,
    "metadata": {},
    "name": "insertWCL5Mutation",
    "operationKind": "mutation",
    "text": "mutation insertWCL5Mutation(\n  $object: coida_claims_wcl_5_insert_input!\n) {\n  insert_coida_claims_wcl_5_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ff3ca30bf27a2048f33711c6c7e0ba35";

module.exports = node;
