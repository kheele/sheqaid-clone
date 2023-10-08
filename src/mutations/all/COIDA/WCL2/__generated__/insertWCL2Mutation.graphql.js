/**
 * @generated SignedSource<<200e6c32bf4b4d1414b3d3600e07e947>>
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
    "concreteType": "coida_claims_wcl_2",
    "kind": "LinkedField",
    "name": "insert_coida_claims_wcl_2_one",
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
    "name": "insertWCL2Mutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertWCL2Mutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7f5fedb73f997db6a57b0efcf4402eeb",
    "id": null,
    "metadata": {},
    "name": "insertWCL2Mutation",
    "operationKind": "mutation",
    "text": "mutation insertWCL2Mutation(\n  $object: coida_claims_wcl_2_insert_input!\n) {\n  insert_coida_claims_wcl_2_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d132ce604b824218d0a40ce1779fc170";

module.exports = node;
