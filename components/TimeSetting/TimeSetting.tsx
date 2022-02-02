import { NextPage } from "next";
import { Dropdown, Form, Grid, Radio } from "semantic-ui-react";
import { useUpdateTheme, useTheme } from "../ThemeProvider/ThemeProvider";
import { useEffect, useState, useCallback } from "react";
import debounce from "@mui/utils/debounce";
import { useEvent } from "../TimeProvider/TimeProvider";

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

interface Props {
  handleClockType: (value: string) => void;

  clockType: string;
  handleAmpm: (value: boolean) => void;
  ampm: boolean;
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
const TimeSetting: NextPage<Props> = (props) => {
  const { id, clock, themeType } = useEvent();

  const newTheme = useUpdateTheme();
  const { primary, secondary, accent } = useTheme();
  const [theme, setTheme] = useState<any>(themeType ? themeType : "Amazon");
  const [clockType, setClockType] = useState(clock ? clock : props.clockType);
  const [ampm, setAmpm] = useState(props.ampm);

  function handleAmpm() {
    props.handleAmpm(!ampm);
    setAmpm(!ampm);
  }

  useEffect(() => {
    switch (theme) {
      case "Light":
        newTheme({
          primary: "whitesmoke",
          secondary: "#898F9C",
          accent: "#4267B2",
        });
        break;
      case "Dark":
        newTheme({
          primary: "#121212",
          secondary: "rgba(255, 255, 255, 0.7)",
          accent: "#5a13a1",
        });
        break;
      case "Amazon":
        newTheme({
          primary: "#ffffff",
          secondary: "#000000",
          accent: "	#FF9900",
        });
        break;
    }
  }, [theme]);

  function handleClockType(value: string) {
    props.handleClockType(value);
    setClockType(value);
  }
  async function save() {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: id,
          clock: clockType,
          theme: theme,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    save();
  }, [clockType, theme]);
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
            text={clockType}
            selection
            options={clockOptions}
            onChange={(e, { value }) =>
              typeof value === "string" && handleClockType(value)
            }
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <h4>Theme</h4>
        </Grid.Column>
        <Grid.Column width={12}>
          <Dropdown
            placeholder="Select Theme"
            text={theme}
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
          <Radio toggle onChange={handleAmpm} checked={!ampm} />
        </Grid.Column>
      </Grid>
    </Form>
  );
};

export default TimeSetting;
