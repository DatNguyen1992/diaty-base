import { Injectable, Inject } from '@nestjs/common';
import { CheckInRepository, CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import { CheckInDto } from '../../dto/check-in.dto';
import type { CheckInRecord } from '../../interfaces/check-in-record.interface';

@Injectable()
export class CheckInUseCase {
  constructor(@Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository) {}

  async execute(dto: CheckInDto): Promise<CheckInRecord> {
    return this.repo.checkIn(dto);
  }
}