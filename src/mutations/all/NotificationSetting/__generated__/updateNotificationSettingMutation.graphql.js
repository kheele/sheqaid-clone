/**
 * @generated SignedSource<<7eff38b1247b033b0e39c3deb592b59d>>
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
    "concreteType": "notifications_settings",
    "kind": "LinkedField",
    "name": "update_notifications_settings_by_pk",
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
    "name": "updateNotificationSettingMutation",
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
    "name": "updateNotificationSettingMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d4ebde68ed8f6e942019743b5b20de75",
    "id": null,
    "metadata": {},
    "name": "updateNotificationSettingMutation",
    "operationKind": "mutation",
    "text": "mutation updateNotificationSettingMutation(\n  $id: notifications_settings_pk_columns_input!\n  $_set: notifications_settings_set_input!\n) {\n  update_notifications_settings_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2ce03dc8cd007f3cbc4043b9c29ab2a6";

module.exports = node;
