/**
 * @generated SignedSource<<2b740536d93b1eb86658ae7ba6c40802>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "default_cities",
    "kind": "LinkedField",
    "name": "update_default_cities_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateCityMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateCityMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "359d4d945b1d518dbcd515568cc0febe",
    "id": null,
    "metadata": {},
    "name": "updateCityMutation",
    "operationKind": "mutation",
    "text": "mutation updateCityMutation(\n  $id: default_cities_pk_columns_input!\n  $_set: default_cities_set_input!\n) {\n  update_default_cities_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a6dc02ff720eca6aeda21df3110d6fab";

module.exports = node;
