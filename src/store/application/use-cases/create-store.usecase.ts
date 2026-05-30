import { Injectable, Inject } from '@nestjs/common';
import { StoreRepository, STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';
import { CreateStoreDto } from '../../dto/create-store.dto';
import type { Store } from '../../interfaces/store.interface';

@Injectable()
export class CreateStoreUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(dto: CreateStoreDto): Promise<Store> {
    return this.storeRepo.create(dto);
  }
}