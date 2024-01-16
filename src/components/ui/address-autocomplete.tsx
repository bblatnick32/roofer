"use client";
import {
  CommandList,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import usePlacesAutocomplete from "use-places-autocomplete";
import { forwardRef } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Libraries, useLoadScript } from "@react-google-maps/api";

// interface PlacesAutocompleteProps {
//   setSelected: (selected: { lat: number; lng: number } | null) => void;
// }

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

const libraries = ["places"] as Libraries;

const AddressAutocomplete = forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  PlacesAutocompleteProps
>(({ value, onValueChange, ...props }, ref) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCHYiZPZx2rD4CAx7i26k04s4WNXn5THDE",
    libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <PlacesAutocomplete
      value={value}
      onValueChange={onValueChange}
      ref={ref}
      {...props}
    />
  );
});

export default AddressAutocomplete;

type PlacesAutocompleteProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive
> & {
  value: string;
  onValueChange: (value: string) => void;
};

const PlacesAutocomplete = forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  PlacesAutocompleteProps
>(({ value, onValueChange, ...props }, ref) => {
  const {
    ready,
    value: autocompleteValue,
    setValue: setAutocompleteValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initPlaces",
    requestOptions: {
      componentRestrictions: {
        country: "us",
      },
      language: "en",
      region: "us",
      types: ["address"],
    },
    debounce: 200,
  });

  const handleSelect = async (address: string) => {
    setAutocompleteValue(address, false);
    onValueChange(address);

    clearSuggestions();

    //   const results = await getGeocode({ address });
    //   if (results[0]) {
    //     const { lat, lng } = await getLatLng(results[0]);
    //     console.log(lat);
    //     console.log(lng);
    //     setSelected({ lat, lng });
    //   } else {
    //     console.log("No results found for this address");
    //   }
  };

  const handleInput = (value: string) => {
    setAutocompleteValue(value);
    onValueChange(value);
  };

  return (
    <Command className="min-h-[213px]" ref={ref} {...props}>
      <CommandInput
        value={autocompleteValue || value}
        onValueChange={handleInput}
        disabled={!ready}
        placeholder="Select an address"
      />
      <CommandList>
        <CommandGroup>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <CommandItem
                key={place_id}
                onSelect={() => {
                  handleSelect(description);
                }}
              >
                {description}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
});
