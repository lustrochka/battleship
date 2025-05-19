export type playerType = {
  name: string;
  index: string | number;
};

export type RoomsType = {
  [key: string | number]: playerType[];
};

export type RegDataType = {
  name: string;
  password: string;
};
