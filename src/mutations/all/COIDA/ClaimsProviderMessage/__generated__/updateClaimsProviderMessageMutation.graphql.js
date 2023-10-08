/**
 * @generated SignedSource<<5e819013a55072322f459ac3cef0db7c>>
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
    "concreteType": "coida_claims_coid_provider_messages",
    "kind": "LinkedField",
    "name": "update_coida_claims_coid_provider_messages_by_pk",
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
    "name": "updateClaimsProviderMessageMutation",
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
    "name": "updateClaimsProviderMessageMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "0d27e1c3489d5d983883ec25b8f13584",
    "id": null,
    "metadata": {},
    "name": "updateClaimsProviderMessageMutation",
    "operationKind": "mutation",
    "text": "mutation updateClaimsProviderMessageMutation(\n  $id: coida_claims_coid_provider_messages_pk_columns_input!\n  $_set: coida_claims_coid_provider_messages_set_input!\n) {\n  update_coida_claims_coid_provider_messages_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a4b7f0813f5c16e3a34dc836643f2197";

module.exports = node;
