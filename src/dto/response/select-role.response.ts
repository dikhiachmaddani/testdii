export interface SelectRoleResponse {
  accessToken: string;
  user: {
    id: string;
    activeRole: {
      roleId: string;
      roleName: string;
    };
  };
}
