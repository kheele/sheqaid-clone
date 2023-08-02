/**
 * @generated SignedSource<<7fc15138363aae2b24f2cbf2abd55bf4>>
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
    "concreteType": "hr_employees_docs_competenciesConnection",
    "kind": "LinkedField",
    "name": "hr_employees_docs_competencies_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees_docs_competenciesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees_docs_competencies",
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
    "name": "findByIdEmployeeCompetencyQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdEmployeeCompetencyQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "35f376fa10be0307e5cf042fcbba77c2",
    "id": null,
    "metadata": {},
    "name": "findByIdEmployeeCompetencyQuery",
    "operationKind": "query",
    "text": "query findByIdEmployeeCompetencyQuery(\n  $id: bigint\n) {\n  hr_employees_docs_competencies_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        employee {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "0e63aebe6722c8847c3afb042d3f5257";

module.exports = node;
