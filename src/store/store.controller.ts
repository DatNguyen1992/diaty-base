import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  async create(@Body() dto: CreateStoreDto) {
    return this.storeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of stores (paginated)' })
  async findAll(@Query() pagination: PaginationDto) {
    const list = await this.storeService.findAll();
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.pageSize ? Number(pagination.pageSize) : 10;
    return this.paginationService.paginate(list, page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  async findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.storeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete store by ID' })
  async remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}