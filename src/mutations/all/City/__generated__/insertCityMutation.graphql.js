/**
 * @generated SignedSource<<a4eabc11f8058b38022d1d6949a566ca>>
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
    "cacheID": "18192b671613de0bf9398e5dfdfe0af1",
    "id": null,
    "metadata": {},
    "name": "insertCityMutation",
    "operationKind": "mutation",
    "text": "mutation insertCityMutation(\n  $object: default_cities_insert_input!\n) {\n  insert_default_cities_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "902868eb6a5f30facdd4b46b7be70743";

module.exports = node;
