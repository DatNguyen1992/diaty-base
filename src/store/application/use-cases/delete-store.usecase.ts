import { Injectable, Inject } from '@nestjs/common';
import { StoreRepository, STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';

@Injectable()
export class DeleteStoreUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(id: string): Promise<{ deleted: boolean }> {
    return this.storeRepo.remove(id);
  }
}