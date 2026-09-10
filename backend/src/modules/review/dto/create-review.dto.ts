import { IsString, IsEmail, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MinLength(2)
  author_name: string;

  @IsEmail()
  author_email: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(3)
  comment: string;
}
