// Selecting the time control among the available ones
// bullet (1+0)
// blitz(3 + 0 and 5 + 0)
// rapid (10 + 0)
// classical (30 + 0)

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIME_CONTROL } from "@/types/play";

export default function TimeControl() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time control" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Control</SelectLabel>
          {TIME_CONTROL.map((control) => {
            return Object.keys(control).map((time, index) => {
              return (
                <SelectItem
                  className="text-black"
                  key={index}
                  value={String(control[time])}
                >
                  {control[time]}
                </SelectItem>
              );
            });
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
