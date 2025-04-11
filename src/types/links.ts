// Navigation links

// show those links when the user is not authenticated
interface INavigationPublic {
  [key: string]: string;
}

// show those links when the user is already authenticated
interface INavigationPrivate {
  [key: string]: string;
}

export const NAVIGATION_PUBLIC: INavigationPublic = {
  Login: "/auth/login",
  Home: "/dashboard",
};

export const NAVIGATION_PRIVATE: INavigationPrivate = {
  Home: "/dashboard",
  Arena: "/arena",
};
