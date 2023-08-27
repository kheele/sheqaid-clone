/**
 * @generated SignedSource<<f7042c80c05e99bfdbc33328a0779a56>>
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
    "name": "object"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_cities",
    "kind": "LinkedField",
    "name": "insert_default_cities_one",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertCityMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertCityMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ea6ad89ca7a09fe1818d507e9f744d00",
    "id": null,
    "metadata": {},
    "name": "insertCityMutation",
    "operationKind": "mutation",
    "text": "mutation insertCityMutation(\n  $object: default_cities_insert_input!\n) {\n  insert_default_cities_one(object: $object) {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "3c0a18e2b80acb315ee13eaf18903317";

module.exports = node;
