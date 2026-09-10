import { IsEmail, IsString } from 'class-validator';

export class TrackOrderDto {
  @IsString()
  orderNumber: string;

  @IsEmail()
  email: string;
}
