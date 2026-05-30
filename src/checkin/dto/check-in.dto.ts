import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO used when a user checks into a store.
 */
export class CheckInDto {
  @ApiProperty({ description: 'Identifier of the user performing the check‑in' })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({ description: 'Identifier of the store where the user checks in' })
  @IsString()
  @IsNotEmpty()
  readonly storeId: string;
}