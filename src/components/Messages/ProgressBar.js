import React from "react";
import { Progress } from "semantic-ui-react";
export default function ProgressBar({ percentUploaded, upLoading }) {
  return (
    upLoading && (
      <Progress
        size="medium"
        indicating
        progress
        percent={percentUploaded}
        color="green"
        className="progress__bar"
        inverted
      ></Progress>
    )
  );
}
