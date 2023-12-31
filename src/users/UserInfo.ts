export interface UserInfo {
  user_Id: number;
  name: string;
  email: string;
}

export enum Status {
  ADMIN = 'admin',
  NORMAL = 'normal',
}
