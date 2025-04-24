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
import React from "react";

interface ITimeControl {
  setTimeControl: React.Dispatch<React.SetStateAction<number>>;
}

export default function TimeControl({ setTimeControl }: ITimeControl) {
  return (
    <Select onValueChange={(time) => setTimeControl(parseInt(time))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time control" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Control</SelectLabel>
          {Object.keys(TIME_CONTROL).map((control) => {
            return TIME_CONTROL[control].map((controlProps, index) => {
              return (
                <SelectItem
                  className="text-black cursor-pointer"
                  key={index}
                  value={String(controlProps.time)}
                >
                  <div className="flex justify-between w-36">
                    <span className="font-semibold inline-block first-letter:capitalize">
                      {control}
                    </span>
                    <span className="font-semibold inline-block first-letter:capitalize">
                      {controlProps.title}
                    </span>
                  </div>
                </SelectItem>
              );
            });
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
