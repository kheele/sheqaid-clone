/**
 * @generated SignedSource<<b0b1074ace87c4e38ab752c0ec85e21d>>
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
    "concreteType": "coida_claims_employer_details",
    "kind": "LinkedField",
    "name": "insert_coida_claims_employer_details_one",
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
    "name": "insertClaimsEmployerDetailsMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertClaimsEmployerDetailsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c9f5602cf4718287f382099efd9da7c2",
    "id": null,
    "metadata": {},
    "name": "insertClaimsEmployerDetailsMutation",
    "operationKind": "mutation",
    "text": "mutation insertClaimsEmployerDetailsMutation(\n  $object: coida_claims_employer_details_insert_input!\n) {\n  insert_coida_claims_employer_details_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f690a34f212f43e5107ddb7abc7cfde2";

module.exports = node;
