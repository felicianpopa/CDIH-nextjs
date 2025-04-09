interface UserDataResponse {
  user_id: string;
  user_roles: string[];
}

export class UserDataMapper {
  user_id: string;
  user_roles: string[];

  constructor(response: UserDataResponse) {
    this.user_id = response.user_id;
    this.user_roles = response.user_roles;
  }

  static map(data: UserDataResponse): UserDataMapper {
    return new UserDataMapper(data);
  }
}
