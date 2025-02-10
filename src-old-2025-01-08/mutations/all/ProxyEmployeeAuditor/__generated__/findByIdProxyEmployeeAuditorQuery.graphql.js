/**
 * @generated SignedSource<<50f172f56d6230aa543ed08b62f108d8>>
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
    "concreteType": "proxy_employee__auditorConnection",
    "kind": "LinkedField",
    "name": "proxy_employee__auditor_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_employee__auditorEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_employee__auditor",
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
    "name": "findByIdProxyEmployeeAuditorQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdProxyEmployeeAuditorQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d566310b0ec705c837412df8ac6dfda2",
    "id": null,
    "metadata": {},
    "name": "findByIdProxyEmployeeAuditorQuery",
    "operationKind": "query",
    "text": "query findByIdProxyEmployeeAuditorQuery(\n  $id: bigint\n) {\n  proxy_employee__auditor_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "ae7e38613bc5632b6809be867d08192b";

module.exports = node;
