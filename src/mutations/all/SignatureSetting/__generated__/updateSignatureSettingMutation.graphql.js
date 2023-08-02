/**
 * @generated SignedSource<<cc7ceb3eb525102ed90596f2cb3f78b2>>
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
    "concreteType": "default_signature_settings",
    "kind": "LinkedField",
    "name": "update_default_signature_settings_by_pk",
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
    "name": "updateSignatureSettingMutation",
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
    "name": "updateSignatureSettingMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f76fcffdb5051ab3b9da000be933608b",
    "id": null,
    "metadata": {},
    "name": "updateSignatureSettingMutation",
    "operationKind": "mutation",
    "text": "mutation updateSignatureSettingMutation(\n  $id: default_signature_settings_pk_columns_input!\n  $_set: default_signature_settings_set_input!\n) {\n  update_default_signature_settings_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "e17053c7b5283d40111fbf771519ad8e";

module.exports = node;
