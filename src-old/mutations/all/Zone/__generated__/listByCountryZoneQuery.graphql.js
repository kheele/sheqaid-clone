/**
 * @generated SignedSource<<f5c44533e4f017a8454d13c2a64b7dd7>>
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
    "concreteType": "default_zonesConnection",
    "kind": "LinkedField",
    "name": "default_zones_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_zonesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_zones",
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
    "name": "listByCountryZoneQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listByCountryZoneQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "37bdaa253468b48b8dc7d24dfb158d74",
    "id": null,
    "metadata": {},
    "name": "listByCountryZoneQuery",
    "operationKind": "query",
    "text": "query listByCountryZoneQuery(\n  $country_iso2: String\n) {\n  default_zones_connection(where: {country_iso2: {_eq: $country_iso2}}) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "0a71535c721bc9d63a41e85113015195";

module.exports = node;
