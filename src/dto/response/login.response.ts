export type LoginResponse = {
  userId: string;
  roles: {
    id: string;
    name: string;
  }[];
};
