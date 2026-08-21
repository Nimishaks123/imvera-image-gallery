export interface RegisterUserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterUserResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}
