/**
 * @generated SignedSource<<8d8a89387195d3235f4e1429ce158279>>
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
    "name": "company_id"
  }
],
v1 = {
  "unit_standard": "asc_nulls_last"
},
v2 = {
  "unit_standard_desc": "asc_nulls_last"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": [
          {
            "course": {
              "name": "asc_nulls_last"
            }
          },
          {
            "course": (v1/*: any*/)
          },
          {
            "course": (v2/*: any*/)
          },
          (v1/*: any*/),
          (v2/*: any*/)
        ]
      },
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "company_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "company_id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_training_matricesConnection",
    "kind": "LinkedField",
    "name": "sheq_training_matrices_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_matricesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_matrices",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "unit_standard",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "date_range_start",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "date_range_end",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_training_courses",
                "kind": "LinkedField",
                "name": "course",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listForSelectionTrainingMatrixByLoggedCompanyQuery",
    "selections": (v4/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listForSelectionTrainingMatrixByLoggedCompanyQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "7a1255616ec9f3501e7449ea537250cf",
    "id": null,
    "metadata": {},
    "name": "listForSelectionTrainingMatrixByLoggedCompanyQuery",
    "operationKind": "query",
    "text": "query listForSelectionTrainingMatrixByLoggedCompanyQuery(\n  $company_id: bigint\n) {\n  sheq_training_matrices_connection(where: {company_id: {_eq: $company_id}}, order_by: [{course: {name: asc_nulls_last}}, {course: {unit_standard: asc_nulls_last}}, {course: {unit_standard_desc: asc_nulls_last}}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}]) {\n    edges {\n      node {\n        id\n        unit_standard\n        date_range_start\n        date_range_end\n        course {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "1b0b519dd70be7352b60187e4fe8758d";

module.exports = node;
