/**
 * @generated SignedSource<<6e440db69ae1c1e943c20d283d999b38>>
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
    "concreteType": "coida_claims_wcl_4",
    "kind": "LinkedField",
    "name": "update_coida_claims_wcl_4_by_pk",
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
    "name": "updateWCL4Mutation",
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
    "name": "updateWCL4Mutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f33e3eda0b4f5728575bdee975128ca9",
    "id": null,
    "metadata": {},
    "name": "updateWCL4Mutation",
    "operationKind": "mutation",
    "text": "mutation updateWCL4Mutation(\n  $id: coida_claims_wcl_4_pk_columns_input!\n  $_set: coida_claims_wcl_4_set_input!\n) {\n  update_coida_claims_wcl_4_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9b3be28d8ac1aab29333bfe870d3dd21";

module.exports = node;
