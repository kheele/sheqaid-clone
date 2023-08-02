/**
 * @generated SignedSource<<69bd6abd4cd3f557017f58ca922a3ba7>>
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
    "concreteType": "hr_employees_docs_warningsConnection",
    "kind": "LinkedField",
    "name": "hr_employees_docs_warnings_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees_docs_warningsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_warnings",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "hr_employees",
                "kind": "LinkedField",
                "name": "employee",
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
    "name": "findByIdEmployeeWarningQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdEmployeeWarningQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ab2271884eef2675d807202939d96749",
    "id": null,
    "metadata": {},
    "name": "findByIdEmployeeWarningQuery",
    "operationKind": "query",
    "text": "query findByIdEmployeeWarningQuery(\n  $id: bigint\n) {\n  hr_employees_docs_warnings_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        employee {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "28cb888d33656b3f94b4710646e39c7b";

module.exports = node;
