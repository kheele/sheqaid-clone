/**
 * @generated SignedSource<<42ea14805a1fd5ec21a6c100878beca3>>
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
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
    "name": "findByIdAuditQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdAuditQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fd8ba71b001a8afbb6626ad1237dc769",
    "id": null,
    "metadata": {},
    "name": "findByIdAuditQuery",
    "operationKind": "query",
    "text": "query findByIdAuditQuery(\n  $id: bigint\n) {\n  sheq_compliance_audits_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "cedea6266bfc7475e55f9248e4ec19e4";

module.exports = node;
