declare type GenericObject = Record<string, unknown>;

declare type UserInput = {
  id?: number;
  email?: string;
  name?: string;
  password?: string;
};

declare type JwtPayload = { userId: number; username: string };

declare type UserTakeout = { name: string; email: string; id: string };
