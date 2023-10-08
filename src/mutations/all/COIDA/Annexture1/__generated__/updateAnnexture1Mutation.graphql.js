/**
 * @generated SignedSource<<b6143fa8c346db17d73a03ca47e303e0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "coida_claims_annexture_1",
    "kind": "LinkedField",
    "name": "update_coida_claims_annexture_1_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAnnexture1Mutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateAnnexture1Mutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7e8dfdf8860ee074712fc158e74ee782",
    "id": null,
    "metadata": {},
    "name": "updateAnnexture1Mutation",
    "operationKind": "mutation",
    "text": "mutation updateAnnexture1Mutation(\n  $id: coida_claims_annexture_1_pk_columns_input!\n  $_set: coida_claims_annexture_1_set_input!\n) {\n  update_coida_claims_annexture_1_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a378803a061963bff0b5994c256e98dc";

module.exports = node;
