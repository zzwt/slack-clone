import { Loader, Dimmer } from "semantic-ui-react";

import React from "react";

export default function Spinner() {
  return (
    <Dimmer active>
      <Loader size="large" content="Loading"></Loader>
    </Dimmer>
  );
}
