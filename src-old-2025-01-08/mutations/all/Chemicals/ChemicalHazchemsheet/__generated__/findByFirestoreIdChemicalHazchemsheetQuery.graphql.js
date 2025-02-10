/**
 * @generated SignedSource<<b56264bf52e8dc78c53cc6473f758845>>
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
    "concreteType": "sheq_chemical_hazchem_sheetsConnection",
    "kind": "LinkedField",
    "name": "sheq_chemical_hazchem_sheets_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_chemical_hazchem_sheetsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_chemical_hazchem_sheets",
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
    "name": "findByFirestoreIdChemicalHazchemsheetQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByFirestoreIdChemicalHazchemsheetQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "faf3352097a25cdf5606d866a8c51c52",
    "id": null,
    "metadata": {},
    "name": "findByFirestoreIdChemicalHazchemsheetQuery",
    "operationKind": "query",
    "text": "query findByFirestoreIdChemicalHazchemsheetQuery(\n  $firestore_id: String\n) {\n  sheq_chemical_hazchem_sheets_connection(where: {firestore_id: {_eq: $firestore_id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "988aaba2b6223c670f842e166acf8846";

module.exports = node;
