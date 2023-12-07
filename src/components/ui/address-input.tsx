import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { Input } from "./input";
import Script from "next/script";
import { forwardRef } from "react";

export interface AddressInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const {
      ready,
      value: autocompleteValue,
      suggestions: { status, data },
      setValue: setAutocompleteValue,
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
    const clickOutsideRef = useOnclickOutside(() => {
      // When the user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update the keyword of the input element
      setAutocompleteValue(e.target.value);
      onChange?.(e);
    };

    const handleSelect =
      ({ description }: { description: string }) =>
      () => {
        // When the user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setAutocompleteValue(description, false);
        onChange?.({ target: { value: description } } as any);
        clearSuggestions();
      };

    const renderSuggestions = () =>
      data.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return (
          <li key={place_id} onClick={handleSelect(suggestion)}>
            {main_text} {secondary_text}
          </li>
        );
      });

    return (
      <div ref={clickOutsideRef}>
        <Input
          value={autocompleteValue || value}
          onChange={handleInput}
          disabled={!ready}
          ref={ref}
          {...props}
        />
        {/* We can use the "status" to decide whether we should display the dropdown or not */}
        {status === "OK" && <ul>{renderSuggestions()}</ul>}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCHYiZPZx2rD4CAx7i26k04s4WNXn5THDE&libraries=places&callback=initPlaces"
          strategy="lazyOnload"
        />
      </div>
    );
  }
);

export default AddressInput;
