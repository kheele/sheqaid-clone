/**
 * @generated SignedSource<<26ebc1d394543b9326da15ee6eda2a75>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "coida_claims_coid_provider_messages",
    "kind": "LinkedField",
    "name": "insert_coida_claims_coid_provider_messages_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "msg",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "read",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "sender",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
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
    "name": "insertClaimsProviderMessageMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertClaimsProviderMessageMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e704eabbd6ef3b587a6dab7ed32c5e78",
    "id": null,
    "metadata": {},
    "name": "insertClaimsProviderMessageMutation",
    "operationKind": "mutation",
    "text": "mutation insertClaimsProviderMessageMutation(\n  $object: coida_claims_coid_provider_messages_insert_input!\n) {\n  insert_coida_claims_coid_provider_messages_one(object: $object) {\n    id\n    date\n    msg\n    read\n    sender {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "17de91d506b9fb0d3d196b3523d6c114";

module.exports = node;
