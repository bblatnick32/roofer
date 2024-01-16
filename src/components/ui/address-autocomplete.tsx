"use client";
import { useLoadScript } from "@react-google-maps/api";
import {
  CommandList,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// interface PlacesAutocompleteProps {
//   setSelected: (selected: { lat: number; lng: number } | null) => void;
// }

export default function AddressAutocomplete() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCHYiZPZx2rD4CAx7i26k04s4WNXn5THDE",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <PlacesAutocomplete />;
}

// function Map() {
//   const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
//     null
//   );
//   const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);

//   return (
//     <>
//       <div>
//         <PlacesAutocomplete setSelected={setSelected} />
//       </div>
//       <GoogleMap
//         zoom={10}
//         center={center}
//         mapContainerClassName="map-container"
//       >
//         {selected && <Marker position={selected} />}
//       </GoogleMap>
//     </>
//   );
// }

const PlacesAutocomplete = () => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    if (results[0]) {
      const { lat, lng } = await getLatLng(results[0]);
      console.log(lat);
      console.log(lng);
      // setSelected({ lat, lng });
    } else {
      console.log("No results found for this address");
    }
  };

  return (
    <Command className="min-h-[213px]">
      <CommandInput
        value={value}
        onValueChange={setValue}
        disabled={!ready}
        placeholder="Select an address"
        className="combobox-input"
      />
      <CommandList>
        <CommandGroup>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <CommandItem key={place_id} onSelect={handleSelect}>
                {description}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
