export type playerType = {
  name: string;
  index: string | number;
};

export type RoomType = {
  roomId: string | number;
  roomUsers: playerType[];
};

export type RegDataType = {
  name: string;
  password: string;
};
