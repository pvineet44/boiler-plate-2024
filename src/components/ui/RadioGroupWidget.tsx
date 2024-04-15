import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SyntheticEvent } from "react";

//@ts-ignore
export function RadioGroupWidget(props) {
  return (
    <RadioGroup defaultValue={props.value} onValueChange={props.onChange}>
      {props.options.enumOptions.map(
        //@ts-ignore
        (en, idx) => {
          return (
            <div className="flex items-center space-x-2" key={idx}>
              <RadioGroupItem value={en.value} id={`radio-option-${idx}`} />
              <Label htmlFor={`radio-option-${idx}`} className="cursor-pointer">
                {en.label}
              </Label>
            </div>
          );
        }
      )}
    </RadioGroup>
  );
}
