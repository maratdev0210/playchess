// sidebar links and content representation

interface ISidebarData {
  title: string;
  items: [];       // TO-DO: find a better way to represent the items field. 
} 

interface ISidebar {
  [key: string]: ISidebarData;
}

export const SIDEBAR_DATA = {
    data: [
        {
            title: "Settings",
            items: [],
        },
        {
            title: "Friends",
            items: []
        }
    ]
}