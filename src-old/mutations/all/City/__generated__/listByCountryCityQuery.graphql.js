/**
 * @generated SignedSource<<2556a7bcbc1cd8367249963143256f74>>
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
    "name": "country_iso2"
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
                "variableName": "country_iso2"
              }
            ],
            "kind": "ObjectValue",
            "name": "country_iso2"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_citiesConnection",
    "kind": "LinkedField",
    "name": "default_cities_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_citiesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_cities",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "listByCountryCityQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listByCountryCityQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cf51c7bfb3de1ad2ea093fb42f901df5",
    "id": null,
    "metadata": {},
    "name": "listByCountryCityQuery",
    "operationKind": "query",
    "text": "query listByCountryCityQuery(\n  $country_iso2: String\n) {\n  default_cities_connection(where: {country_iso2: {_eq: $country_iso2}}) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "5b7157b3b32ba7d83ea884bf03b25f71";

module.exports = node;
