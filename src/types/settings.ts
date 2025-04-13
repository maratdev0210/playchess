// Settings option list

interface Items {
  title: string;
  id: number;
  isActive: boolean;
}

interface ISettings {
  title: string; // e.g. General Settings, Game preferences, etc..
  id: number; // identify the selected settings choice and display the corresponding component on the page
  items: Items[]; // types of settings -> sounds, focus mode, etc..
}

export const SETTINGS: ISettings[] = [
  {
    title: "General",
    id: 0,
    items: [
      {
        title: "Sounds",
        id: 0,
        isActive: false,
      },
      {
        title: "Focus Mode",
        id: 1,
        isActive: false,
      },
    ],
  },
  {
    title: "Other",
    id: 1,
    items: [
      {
        title: "Other",
        id: 2,
        isActive: false,
      },
    ],
  },
];
