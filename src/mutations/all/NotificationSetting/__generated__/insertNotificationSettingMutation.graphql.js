/**
 * @generated SignedSource<<18f164dc276470ff1003f7072c585f4b>>
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
    "concreteType": "notifications_settings",
    "kind": "LinkedField",
    "name": "insert_notifications_settings_one",
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
    "name": "insertNotificationSettingMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertNotificationSettingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "29ae4a58b9aca9b77b1db5bc5c112580",
    "id": null,
    "metadata": {},
    "name": "insertNotificationSettingMutation",
    "operationKind": "mutation",
    "text": "mutation insertNotificationSettingMutation(\n  $object: notifications_settings_insert_input!\n) {\n  insert_notifications_settings_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "71dfd53cfa620142b71b4b1492a0e89b";

module.exports = node;
