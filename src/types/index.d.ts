declare type GenericObject = Record<string, unknown>;

declare type UserInput = {
  id?: number;
  email?: string;
  name?: string;
  password?: string;
};

declare type JwtPayload = { userId: number; username: string };


declare type ProductInput = {
  id?: number;
  category?: string;
  name?: string;
  colour?: string;
  description?: string;
  price?: string;
  size?: string;
  material?: string;
  care?: string;
  season?: string;
};

declare type UserTakeout = { name: string; email: string; id: string };

declare type SeasonInput = {
  id?: number;
  name?: string;
  year?: number;
};
