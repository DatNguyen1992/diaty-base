import { Injectable, Inject } from '@nestjs/common';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';
import type { Store } from '../../interfaces/store.interface';

@Injectable()
export class GetStoreUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(id: string): Promise<Store> {
    return this.storeRepo.findOne(id);
  }
}