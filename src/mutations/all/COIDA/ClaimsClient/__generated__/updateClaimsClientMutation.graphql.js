/**
 * @generated SignedSource<<6d40ec8efccf879810ba94e376082108>>
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
    "concreteType": "coida_claims",
    "kind": "LinkedField",
    "name": "update_coida_claims_by_pk",
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
    "name": "updateClaimsClientMutation",
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
    "name": "updateClaimsClientMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "02671cdadbb209f90ed279abad8da45c",
    "id": null,
    "metadata": {},
    "name": "updateClaimsClientMutation",
    "operationKind": "mutation",
    "text": "mutation updateClaimsClientMutation(\n  $id: coida_claims_pk_columns_input!\n  $_set: coida_claims_set_input!\n) {\n  update_coida_claims_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "1868c38a7abed0156f987146a070fb61";

module.exports = node;
