/**
 * @generated SignedSource<<71db3730768d3c50f954dab9cfbf1760>>
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
    "concreteType": "coida_claims_wcl_6",
    "kind": "LinkedField",
    "name": "update_coida_claims_wcl_6_by_pk",
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
    "name": "updateWCL6Mutation",
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
    "name": "updateWCL6Mutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b930ea09e65741eb77ccee38ec2c3d59",
    "id": null,
    "metadata": {},
    "name": "updateWCL6Mutation",
    "operationKind": "mutation",
    "text": "mutation updateWCL6Mutation(\n  $id: coida_claims_wcl_6_pk_columns_input!\n  $_set: coida_claims_wcl_6_set_input!\n) {\n  update_coida_claims_wcl_6_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cc52fff31ca360f4edd3a3cfe9baa3a7";

module.exports = node;
