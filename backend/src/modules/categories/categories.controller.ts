import { Controller, Get, Post, Body, Param , UseGuards} from '@nestjs/common';
import { IsPublic } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CategoriesService } from './categories.service';

/**
 * CategoriesController
 * Exposes endpoints for managing categories.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @IsPublic()
  @IsPublic()
  @Get()
  getAllCategories() {
    return this.categoriesService.findAll();
  }

  @IsPublic()
  @IsPublic()
  @Get(':id')
  getCategory(@Param('id') id: string) {
    return this.categoriesService.findById(+id);
  }

  @Post()
  createCategory(@Body() data: any) {
    return this.categoriesService.create(data);
  }
}
