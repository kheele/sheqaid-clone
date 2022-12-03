import * as React from "react";
import PropTypes from "prop-types";
import {Dates} from "utils/Dates";
import RowImg from "components/Omni/RowImg";
import OmniTable from "components/Omni/OmniTable";
import ActionsButton from "components/Omni/ActionsButton";
import {useEffect, useState} from "react";

// <editor-fold desc="columns">
const columns = [
  {
    Header: "Date Created",
    accessor: (row) => Dates.formatDate(row.date_created),
    width: "100px",
    align: "left",
  },
  { Header: "Type", accessor: "data.type", width: "50px", align: "left" },
  { Header: "Status", accessor: "data.status", width: "50px", align: "left" },
  { Header: "Accreditation", accessor: "data.training_provider_requirement", width: "50px", align: "left" },
  { Header: "Job Title", accessor: ({id, data: {job_title}}) => job_title ? job_title.name : 'N/A', align: "left" },
  { Header: "Course", accessor: ({id, data: {course_or_module}}) => isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : (course_or_module || 'N/A'), align: "left" },
  { Header: "Requirement", accessor: "data.requirement", width: "50px", align: "left" },
  {
    Header: "Actions",
    accessor: (row) => <ActionsButton row={row} />,
    width: "60px",
    align: "right",
  },
];
// </editor-fold>

function Comp({ sx }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    (async () => {
      const path = "plugin_sheq_assist/05_Trainings/training-plan/";

      neonBinding.events.emit(path + "list").then(list => {
        console.log("list", list)
        setRows(list);
      });
    })();
  }, []);
  if(rows === null) {
    return null;
  }

  const actions = ["View"];

  const onClick = ({ action, row }) => {
    switch (action) {
      case "View":
        break;
      default:
        break;
    }
  };

  // const rows = [
  //   {id: "1", data: {}},
  //   {id: "2", data: {}},
  //   {id: "3", data: {}},
  //   {id: "4", data: {}},
  //   {id: "5", data: {}},
  // ];

  return <OmniTable
      actions={actions}
      columns={columns}
      rows={rows}
      showTotalEntries={false}
      canSearch={false}
      entriesPerPage={false}
      onClick={onClick}
  />;
}

Comp.defaultProps = {
  sx: {},
};

Comp.propTypes = {
  sx: PropTypes.objectOf(PropTypes.object),
};

export default Comp;
