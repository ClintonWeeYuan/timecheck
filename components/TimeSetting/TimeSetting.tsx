import { NextPage } from "next";
import { Dropdown, Form, Grid, Radio } from "semantic-ui-react";

const clockOptions = [
  {
    key: "Analog",
    text: "Analog",
    value: "Analog",
  },

  {
    key: "Digital",
    text: "Digital",
    value: "Digital",
  },

  {
    key: "Countdown",
    text: "Countdown",
    value: "Countdown",
  },
];

const timezoneOptions = [
  {
    key: "Singapore (UTC+8)",
    text: "Singapore (UTC+8)",
    value: "Singapore (UTC+8)",
  },

  {
    key: "United Kingdom (UTC)",
    text: "United Kingdom (UTC)",
    value: "United Kingdom (UTC)",
  },

  {
    key: "US (GMT -5)",
    text: "US (GMT -5)",
    value: "US (GMT -5)",
  },
];
const TimeSetting: NextPage = () => {
  return (
    <Form>
      <Grid columns={2}>
        <Grid.Column width={4}>
          <h4>Clock Type</h4>
        </Grid.Column>
        <Grid.Column width={12}>
          <Dropdown
            placeholder="Select Clock Type"
            fluid
            selection
            options={clockOptions}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <h4>Time Zone</h4>
        </Grid.Column>
        <Grid.Column width={12}>
          <Dropdown
            placeholder="Select Timezone"
            fluid
            selection
            options={timezoneOptions}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <h4>24 Hour</h4>
        </Grid.Column>
        <Grid.Column width={12}>
          <Radio label="24 Hour" />
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default TimeSetting;
