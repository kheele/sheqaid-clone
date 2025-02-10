/**
 * @generated SignedSource<<526fc6b364ec68cb76f4741438280c73>>
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
    "concreteType": "coida_claims_wcl_2",
    "kind": "LinkedField",
    "name": "update_coida_claims_wcl_2_by_pk",
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
    "name": "updateWCL2Mutation",
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
    "name": "updateWCL2Mutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "42afe7857b4a1781e888bea0b4ce403c",
    "id": null,
    "metadata": {},
    "name": "updateWCL2Mutation",
    "operationKind": "mutation",
    "text": "mutation updateWCL2Mutation(\n  $id: coida_claims_wcl_2_pk_columns_input!\n  $_set: coida_claims_wcl_2_set_input!\n) {\n  update_coida_claims_wcl_2_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a66d93815a35ab99badaa10d8730349a";

module.exports = node;
