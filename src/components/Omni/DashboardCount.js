// <editor-fold desc="imports">
import * as React from "react";
import { QueryRenderer } from "react-relay";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import { CircularProgress } from "@mui/material";
import environment from "Environment";
// </editor-fold>

const labels = {
  Day: "yesterday",
  Week: "last week",
  Month: "last month",
  Quarter: "last 3 months",
  "Bi-Annual": "last 6 months",
  Annual: "last year",
};

// eslint-disable-next-line camelcase
function Comp({ interval, query, connection_aggregate_key, color, title }) {
  const percLabel = `than ${labels[interval]}`;
  // <editor-fold desc="render">
  const render = ({ error, props }) => {
    if (error) {
      return <div>{error.message}</div>;
    }
    if (props) {
      // eslint-disable-next-line react/prop-types
      const { edges = [] } = props.stores_connection || {};
      // eslint-disable-next-line react/prop-types
      const count = edges
        .map(
          ({
            node: {
              // eslint-disable-next-line camelcase
              [connection_aggregate_key]: {
                // eslint-disable-next-line no-shadow
                aggregate: { count },
              },
            },
          }) => count
        )
        .reduce((n1, n2) => n1 + n2, 0);
      return (
        <DefaultCounterCard
          color={color}
          title={title}
          desc={percLabel}
          count={count}
          radius="50%"
        />
      );
    }
    return <CircularProgress size="2rem" />;
  };
  // </editor-fold>

  return <QueryRenderer environment={environment} query={query} render={render} />;
}

Comp.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  title: PropTypes.string.isRequired,
  interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
  query: PropTypes.objectOf(PropTypes.object).isRequired,
  connection_aggregate_key: PropTypes.string.isRequired,
};

export default Comp;
