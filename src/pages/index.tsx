import { withTheme, ThemeProps } from "@rjsf/core";
import { IntegerInput } from "@/components/ui/IntegerInput";
import { Input } from "@/components/ui/Input";
import { SelectWidget } from "@/components/ui/SelectWidget";
import { ChangeEvent } from "react";

export default function Home() {
  return (
    <div>
      Main
    </div>
  );
}

const myWidgets = {
  InputWidget: (props: any) => {
    const customOnBlur = props.options?.onBlur;
    const customOnChange = props.options?.onChange;
    const disabled = props.disabled;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (customOnChange) {
        props.onChange(event.target.value); // Use custom onChange if available
        customOnChange(event);
      } else {
        props.onChange(event.target.value); // Fallback to default onChange
      }
    };

    return (
      <Input
        defaultValue={props.value}
        placeholder={props.placeholder}
        onChange={handleChange}
        value={props.value}
        required={props.required}
        onBlur={(e:any) => {
          if (customOnBlur) {
            customOnBlur(e);
          }
        }}
        disabled={disabled}
      />
    );
  },
  SelectWidget: (props: any) => (
    <SelectWidget
      {...props}
      onChange={(value:any) => {
        console.log("Changed to", value); // More consistent logging
        if (props.onChange) {
          props.onChange(value); // Safely call the passed onChange, if it exists
        }
      }}
    />
  ),
};

const theme: ThemeProps = { widgets: myWidgets };
export const ThemedForm = withTheme(theme);
