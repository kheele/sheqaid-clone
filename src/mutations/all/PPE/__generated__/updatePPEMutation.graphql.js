/**
 * @generated SignedSource<<27adf534e3c0c989077221c25b6aef8c>>
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
    "concreteType": "ppe_types",
    "kind": "LinkedField",
    "name": "update_ppe_types_by_pk",
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
    "name": "updatePPEMutation",
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
    "name": "updatePPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "eb15978db534c312cf477b7beacaef9c",
    "id": null,
    "metadata": {},
    "name": "updatePPEMutation",
    "operationKind": "mutation",
    "text": "mutation updatePPEMutation(\n  $id: ppe_types_pk_columns_input!\n  $_set: ppe_types_set_input!\n) {\n  update_ppe_types_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3cc53416580c86c88b72cf4880f652f2";

module.exports = node;
