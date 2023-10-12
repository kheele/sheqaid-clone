/**
 * @generated SignedSource<<d881799c10a3005955cd81b565449765>>
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
    "concreteType": "proxy_incident__investigatorConnection",
    "kind": "LinkedField",
    "name": "proxy_incident__investigator_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "proxy_incident__investigatorEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "proxy_incident__investigator",
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
    "name": "findByIdProxyEmployeeIncidentInvestigatorQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdProxyEmployeeIncidentInvestigatorQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ae32621cd70e7c2057e9b8d4a19ad946",
    "id": null,
    "metadata": {},
    "name": "findByIdProxyEmployeeIncidentInvestigatorQuery",
    "operationKind": "query",
    "text": "query findByIdProxyEmployeeIncidentInvestigatorQuery(\n  $id: bigint\n) {\n  proxy_incident__investigator_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "98df102b373ce104508c61c20963c52f";

module.exports = node;
