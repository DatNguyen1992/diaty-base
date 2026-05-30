export class CreateUserDto {
  name: string;
  email: string;
  phone_number?: string;
  ref_code?: string;
  invite_code?: string;
  rank?: string;
  role?: string;
}