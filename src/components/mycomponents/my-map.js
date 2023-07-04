import { GOOGLE_API_KEY } from "constants/App";
import GoogleMapReact from "google-map-react";
import { useState } from "react";
import { MdMap } from "react-icons/md";

const AnyReactComponent = () => (
  <div>
    <MdMap size={20} />
  </div>
);
export default function MyMap({ lat, lng }) {
  const [mapKey, setMapKey] = useState(0);

  const handleApiLoaded = async (map, maps) => {};

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <GoogleMapReact
        key={mapKey}
        bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
        center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
        defaultCenter={{
          lat: -7.28792,
          lng: 112.8104065,
        }}
        defaultZoom={12}
        geo
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {lat && lng && (
          <AnyReactComponent lat={parseFloat(lat)} lng={parseFloat(lng)} />
        )}
      </GoogleMapReact>
    </div>
  );
}
