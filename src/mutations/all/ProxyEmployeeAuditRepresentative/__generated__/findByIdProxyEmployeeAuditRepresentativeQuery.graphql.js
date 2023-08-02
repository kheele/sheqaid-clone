/**
 * @generated SignedSource<<8c12a108f88cd3b3776d2e8e3ed4f8b4>>
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
    "concreteType": "proxy_employee__audit_representativeConnection",
    "kind": "LinkedField",
    "name": "proxy_employee__audit_representative_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_employee__audit_representativeEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_employee__audit_representative",
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
    "name": "findByIdProxyEmployeeAuditRepresentativeQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdProxyEmployeeAuditRepresentativeQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2574256605b38309053eafbdccdf0e49",
    "id": null,
    "metadata": {},
    "name": "findByIdProxyEmployeeAuditRepresentativeQuery",
    "operationKind": "query",
    "text": "query findByIdProxyEmployeeAuditRepresentativeQuery(\n  $id: bigint\n) {\n  proxy_employee__audit_representative_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "981ef216b6ca02099535f9af3b626022";

module.exports = node;
