/**
 * @generated SignedSource<<84216351d0372deda3efaad7335266c9>>
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v7 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
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
    "name": "updateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "update_default_users_by_pk",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "UserFragment"
          }
        ],
        "storageKey": null
      }
    ],
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
    "name": "updateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "update_default_users_by_pk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "auth_id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "created_at",
            "storageKey": null
          },
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "username",
            "storageKey": null
          },
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profile_pic",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "auth_type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "notifications_settings",
            "kind": "LinkedField",
            "name": "notifications_settings",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_asset_management_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_chemicals_management_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_contractor_management_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_covid_positive_case_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_covid_return_to_work_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_covid_screening_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_covid_vulnerability_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_expired_docs_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_incident_management_notifs",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "receive_non_conformance_management_notifs",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "hr_employees",
            "kind": "LinkedField",
            "name": "linked_employee",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "default_companies",
            "kind": "LinkedField",
            "name": "company",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "default_clients",
            "kind": "LinkedField",
            "name": "client",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "default_projects",
            "kind": "LinkedField",
            "name": "project",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "default_sites",
            "kind": "LinkedField",
            "name": "site",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "015a643efb1c8fb03b926fb427c7db77",
    "id": null,
    "metadata": {},
    "name": "updateUserMutation",
    "operationKind": "mutation",
    "text": "mutation updateUserMutation(\n  $id: default_users_pk_columns_input!\n  $_set: default_users_set_input!\n) {\n  update_default_users_by_pk(pk_columns: $id, _set: $_set) {\n    ...UserFragment\n    id\n  }\n}\n\nfragment UserFragment on default_users {\n  id\n  auth_id\n  created_at\n  fname\n  lname\n  username\n  phone\n  profile_pic\n  auth_type\n  notifications_settings {\n    id\n    receive_asset_management_notifs\n    receive_chemicals_management_notifs\n    receive_contractor_management_notifs\n    receive_covid_positive_case_notifs\n    receive_covid_return_to_work_notifs\n    receive_covid_screening_notifs\n    receive_covid_vulnerability_notifs\n    receive_expired_docs_notifs\n    receive_incident_management_notifs\n    receive_non_conformance_management_notifs\n  }\n  linked_employee {\n    id\n    fname\n    lname\n    email\n    phone\n  }\n  company {\n    id\n    name\n  }\n  client {\n    id\n    name\n  }\n  project {\n    id\n    name\n  }\n  site {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "3b3fcd48c34c53b7d1d87489f56245a3";

module.exports = node;
