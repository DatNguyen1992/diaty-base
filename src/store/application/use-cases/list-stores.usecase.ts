import { Injectable, Inject } from '@nestjs/common';
import { StoreRepository, STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';
import type { Store } from '../../interfaces/store.interface';

@Injectable()
export class ListStoresUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(): Promise<Store[]> {
    return this.storeRepo.findAll();
  }
}