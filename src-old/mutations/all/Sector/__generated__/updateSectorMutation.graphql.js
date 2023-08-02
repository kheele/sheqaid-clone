/**
 * @generated SignedSource<<6236ac88bd8217318e899d3a780db00f>>
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
    "concreteType": "default_sectors",
    "kind": "LinkedField",
    "name": "update_default_sectors_by_pk",
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
    "name": "updateSectorMutation",
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
    "name": "updateSectorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "983b88dc68f02fe9f162ac4e4f2fb37e",
    "id": null,
    "metadata": {},
    "name": "updateSectorMutation",
    "operationKind": "mutation",
    "text": "mutation updateSectorMutation(\n  $id: default_sectors_pk_columns_input!\n  $_set: default_sectors_set_input!\n) {\n  update_default_sectors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9f7c7d5254c56be3a688c4fe929a3af1";

module.exports = node;
