/**
 * @generated SignedSource<<dce1cd5f221d42042a41b859bb75f207>>
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
    "name": "site_id"
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
                "variableName": "site_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "site_id"
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
    "name": "listForSelectionTrainingMatrixByLoggedSiteQuery",
    "selections": (v4/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listForSelectionTrainingMatrixByLoggedSiteQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "cdd6a46cbc7b4019ad71ff13bea819ea",
    "id": null,
    "metadata": {},
    "name": "listForSelectionTrainingMatrixByLoggedSiteQuery",
    "operationKind": "query",
    "text": "query listForSelectionTrainingMatrixByLoggedSiteQuery(\n  $site_id: bigint\n) {\n  sheq_training_matrices_connection(where: {site_id: {_eq: $site_id}}, order_by: [{course: {name: asc_nulls_last}}, {course: {unit_standard: asc_nulls_last}}, {course: {unit_standard_desc: asc_nulls_last}}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}]) {\n    edges {\n      node {\n        id\n        unit_standard\n        date_range_start\n        date_range_end\n        course {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "82bd8e8db886d465a1b11cd3368d5f9c";

module.exports = node;
