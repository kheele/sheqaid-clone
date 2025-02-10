/**
 * @generated SignedSource<<e65de1ae9d068439e17d4e655c2691a1>>
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
    "name": "firestore_id"
  }
],
v1 = [
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
                "variableName": "firestore_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "firestore_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_compliance_auditsConnection",
    "kind": "LinkedField",
    "name": "sheq_compliance_audits_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_compliance_auditsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_compliance_audits",
            "kind": "LinkedField",
            "name": "node",
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
    "name": "findByFirestoreIdAuditQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdAuditQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "aec4d923ababfce09aa1db625fded276",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdAuditQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdAuditQuery(\n  $firestore_id: String\n) {\n  sheq_compliance_audits_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "0301a57b6dfacd7c70eb2fe472657dc2";

module.exports = node;
