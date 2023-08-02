/**
 * @generated SignedSource<<6b0018b6e13e2e1fd340a05a22691a2c>>
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
    "name": "client_id"
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
  (v1/*: any*/)
],
v3 = [
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
                "variableName": "client_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "client_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_signature_settingsConnection",
    "kind": "LinkedField",
    "name": "default_signature_settings_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_signature_settingsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_signature_settings",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "is_employee_owning",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_manager_module",
                "kind": "LinkedField",
                "name": "module",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_manager_plugin",
                "kind": "LinkedField",
                "name": "plugin",
                "plural": false,
                "selections": (v2/*: any*/),
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
    "name": "listAllSignatureSettingByLoggedClientQuery",
    "selections": (v3/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listAllSignatureSettingByLoggedClientQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "19dba5ebf8c214030efaa4705b5bb3ad",
    "id": null,
    "metadata": {},
    "name": "listAllSignatureSettingByLoggedClientQuery",
    "operationKind": "query",
    "text": "query listAllSignatureSettingByLoggedClientQuery(\n  $client_id: bigint\n) {\n  default_signature_settings_connection(where: {client_id: {_eq: $client_id}}) {\n    edges {\n      node {\n        id\n        created_at\n        is_employee_owning\n        module {\n          id\n        }\n        plugin {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "7e63aa3a57900ff188a04e9de0e9209c";

module.exports = node;
