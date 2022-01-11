import { NextPage } from "next";
import { Dropdown, Form, Grid, Radio } from "semantic-ui-react";
import { useUpdateTheme } from "../TimeProvider/TimeProvider";
import { useEffect, useState } from "react";

interface Theme {
  primary: string;
  secondary: string;
  neutral: string;
}

const themeOptions = [
  {
    key: "Light",
    text: "Light",
    value: "Light",
  },

  {
    key: "Dark",
    text: "Dark",
    value: "Dark",
  },

  {
    key: "Amazon",
    text: "Amazon",
    value: "Amazon",
  },
];
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
  const newTheme = useUpdateTheme();
  const [theme, setTheme] = useState<any>();

  useEffect(() => {
    switch (theme) {
      case "Light":
        newTheme({ primary: "blue", secondary: "green", neutral: "yellow" });
        break;
      case "Dark":
        newTheme({ primary: "pink", secondary: "green", neutral: "yellow" });
        break;
      case "Amazon":
        newTheme({ primary: "orange", secondary: "green", neutral: "yellow" });
        break;
    }
  }, [theme]);
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
          {theme}
          <h4>Theme</h4>
        </Grid.Column>
        <Grid.Column width={12}>
          <Dropdown
            placeholder="Select Theme"
            fluid
            selection
            options={themeOptions}
            onChange={(e, { value }) => setTheme(value)}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <h4>24 Hour</h4>
        </Grid.Column>
        <Grid.Column width={12}>
          <Radio toggle />
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default TimeSetting;
