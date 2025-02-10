/**
 * @generated SignedSource<<78c48547d20985729beedf3faa99cb4a>>
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
    "name": "id"
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
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "coida_claims_coid_provider_messagesConnection",
    "kind": "LinkedField",
    "name": "coida_claims_coid_provider_messages_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "coida_claims_coid_provider_messagesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "coida_claims_coid_provider_messages",
            "kind": "LinkedField",
            "name": "node",
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
    "name": "findByIdClaimsProviderMessageQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdClaimsProviderMessageQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "cfc15889da41c01c8474140869bda404",
    "id": null,
    "metadata": {},
    "name": "findByIdClaimsProviderMessageQuery",
    "operationKind": "query",
    "text": "query findByIdClaimsProviderMessageQuery(\n  $id: bigint\n) {\n  coida_claims_coid_provider_messages_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        date\n        msg\n        read\n        sender {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "325062c84c5c7d7716a5a38ed180e2f3";

module.exports = node;
