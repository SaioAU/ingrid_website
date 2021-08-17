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
  price?: number;
  size?: number;
  material?: string;
  care?: string;
  images: { data: string, colour: string}[];
  seasonId?: string;
};

declare type UserTakeout = { name: string; email: string; id: string };

declare type SeasonInput = {
  id?: number;
  name?: string;
  year?: number;
};
