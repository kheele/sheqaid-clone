/**
 * @generated SignedSource<<1719995687ecf7a51045715bd9801682>>
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
    "concreteType": "hr_employees_docs_counsellingsConnection",
    "kind": "LinkedField",
    "name": "hr_employees_docs_counsellings_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees_docs_counsellingsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_counsellings",
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
    "name": "findByIdEmployeeCounsellingQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdEmployeeCounsellingQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "cd94c28fb3aab0b0b0d9f3ce36a32c5f",
    "id": null,
    "metadata": {},
    "name": "findByIdEmployeeCounsellingQuery",
    "operationKind": "query",
    "text": "query findByIdEmployeeCounsellingQuery(\n  $id: bigint\n) {\n  hr_employees_docs_counsellings_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        employee {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "9e765539c74492622c6fd266248b80d8";

module.exports = node;
