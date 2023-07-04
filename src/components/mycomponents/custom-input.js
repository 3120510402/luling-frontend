import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import GoogleMapReact from "google-map-react";
import { GOOGLE_API_KEY } from "constants/App";

export default function CustomInput({
  label,
  value,
  onChange = () => {},
  type = "text",
  options = null,
  name = "",
}) {
  return (
    <FormControl>
      <FormLabel style={{ color: "#444" }}>{label}</FormLabel>
      {type === "text" ? (
        <Input
          style={{ color: "#444" }}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          name={name}
        />
      ) : type === "textarea" ? (
        <Textarea
          style={{ color: "#444" }}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          name={name}
        />
      ) : type === "file" ? (
        <Input
          type={type}
          accept={options?.accept ?? "image/*"}
          onChange={(e) => {
            console.log(e.target.files.length);
            if (e.target.files.length > 0) {
              const isMultiple = options?.multiple ?? false;
              if (isMultiple) {
                onChange(e.target.files);
                return;
              }
              onChange(e.target.files[0]);
            }
          }}
          name="icon"
        />
      ) : type === "radio" ? (
        options &&
        Object.entries(options).length && (
          <Stack spacing={[1, 5]} direction={["column", "row"]}>
            {Object.entries(options).map((item) => {
              console.log(value === item[0]);
              return (
                <div key={item[0]}>
                  <input
                    name={name}
                    type="radio"
                    colorScheme="green"
                    value={item[0]}
                    onChange={(e) => onChange(e.target.value)}
                    checked={value == item[0]}
                  ></input>
                  {item[1]}
                </div>
              );
            })}
          </Stack>
        )
      ) : type === "select" ? (
        <ReactSelect
          defaultValue={value}
          onChange={(values) => onChange(values.value)}
          options={options || []}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      ) : type === "map" ? (
        <div
          style={{
            height: options?.height ?? "100vh",
            width: options?.width ?? "100%",
          }}
        >
          <GoogleMapReact
            key={options?.key ?? 1}
            bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
            defaultCenter={options?.center ?? { lat: 10, lng: 10 }}
            defaultZoom={options?.zoom ?? 11}
            geo
            libraries={options?.libraries ?? ["geometry"]}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => onChange(map, maps)}
          ></GoogleMapReact>
        </div>
      ) : null}
    </FormControl>
  );
}
