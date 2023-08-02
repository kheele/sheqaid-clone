/**
 * @generated SignedSource<<6baa5ed007b029cf0113ac067e5cd3ba>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "full_name",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "username",
    "storageKey": null
  }
],
v4 = [
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
    "concreteType": "default_contractor_questionnaires_messages",
    "kind": "LinkedField",
    "name": "update_default_contractor_questionnaires_messages_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "question_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "msg",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "read",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sender_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "recipient_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "contractor_sender_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "contractor_recipient_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "sender",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "recipient",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_users",
        "kind": "LinkedField",
        "name": "contractor_sender",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_users",
        "kind": "LinkedField",
        "name": "contractor_recipient",
        "plural": false,
        "selections": (v3/*: any*/),
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
    "name": "updateMessageMutation",
    "selections": (v4/*: any*/),
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
    "name": "updateMessageMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "c10c853035b77e38b48032e1bebd85d5",
    "id": null,
    "metadata": {},
    "name": "updateMessageMutation",
    "operationKind": "mutation",
    "text": "mutation updateMessageMutation(\n  $id: default_contractor_questionnaires_messages_pk_columns_input!\n  $_set: default_contractor_questionnaires_messages_set_input!\n) {\n  update_default_contractor_questionnaires_messages_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    question_id\n    date\n    msg\n    read\n    sender_id\n    recipient_id\n    contractor_sender_id\n    contractor_recipient_id\n    sender {\n      id\n      full_name\n      username\n    }\n    recipient {\n      id\n      full_name\n      username\n    }\n    contractor_sender {\n      id\n      full_name\n      username\n    }\n    contractor_recipient {\n      id\n      full_name\n      username\n    }\n  }\n}\n"
  }
};
})();

node.hash = "ea91731b79cb97c893c9728ffacf0524";

module.exports = node;
