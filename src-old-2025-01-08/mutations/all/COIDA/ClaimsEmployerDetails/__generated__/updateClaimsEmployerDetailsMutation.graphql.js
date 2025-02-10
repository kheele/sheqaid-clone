/**
 * @generated SignedSource<<bc2385fda991c9671e3a1c710fb5d7dd>>
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
    "concreteType": "coida_claims_employer_details",
    "kind": "LinkedField",
    "name": "update_coida_claims_employer_details_by_pk",
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
    "name": "updateClaimsEmployerDetailsMutation",
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
    "name": "updateClaimsEmployerDetailsMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d436cb92468dcfee19f499879a72a421",
    "id": null,
    "metadata": {},
    "name": "updateClaimsEmployerDetailsMutation",
    "operationKind": "mutation",
    "text": "mutation updateClaimsEmployerDetailsMutation(\n  $id: coida_claims_employer_details_pk_columns_input!\n  $_set: coida_claims_employer_details_set_input!\n) {\n  update_coida_claims_employer_details_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "fdd8966220f44e7509b862e4366919e9";

module.exports = node;
