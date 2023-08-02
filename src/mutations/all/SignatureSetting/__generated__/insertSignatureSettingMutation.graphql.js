/**
 * @generated SignedSource<<c3f078178f118ccd8b796044bf26ae7d>>
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
    "concreteType": "default_signature_settings",
    "kind": "LinkedField",
    "name": "insert_default_signature_settings_one",
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
    "name": "insertSignatureSettingMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSignatureSettingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5f51f962de3ba8fde8ffbcac699fb8ef",
    "id": null,
    "metadata": {},
    "name": "insertSignatureSettingMutation",
    "operationKind": "mutation",
    "text": "mutation insertSignatureSettingMutation(\n  $object: default_signature_settings_insert_input!\n) {\n  insert_default_signature_settings_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "dbfbb10ace4e9ebdcb93d69091828c3c";

module.exports = node;
