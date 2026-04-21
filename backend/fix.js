const fs = require('fs');
const path = require('path');

const controllers = [
  'src/modules/bookings/bookings.controller.ts',
  'src/modules/payments/payments.controller.ts',
  'src/modules/reviews/reviews.controller.ts',
  'src/modules/schedules/schedules.controller.ts',
  'src/modules/addresses/addresses.controller.ts',
  'src/modules/notification/notification.controller.ts',
  'src/modules/categories/categories.controller.ts'
];

function processController(file) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log("Not found:", filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('UseGuards')) {
    content = content.replace(/import {([^}]+)} from '@nestjs\/common';/, (match, p1) => {
      return `import {${p1}, UseGuards} from '@nestjs/common';`;
    });
  }

  if (!content.includes('JwtAuthGuard')) {
    content = content.replace(/(import .* from '@nestjs\/common';)/, `$1\nimport { JwtAuthGuard } from '../auth/jwt-auth.guard';\nimport { RolesGuard } from '../auth/roles.guard';`);
  }
  
  if (file.includes('categories') && !content.includes('IsPublic')) {
    content = content.replace(/(import .* from '@nestjs\/common';)/, `$1\nimport { IsPublic } from '../../common/decorators/public.decorator';`);
  }

  if (!content.includes('@UseGuards(JwtAuthGuard, RolesGuard)')) {
    content = content.replace(/@Controller\(/g, `@UseGuards(JwtAuthGuard, RolesGuard)\n@Controller(`);
  }

  if (file.includes('categories')) {
    content = content.replace(/@Get\(/g, `@IsPublic()\n  @Get(`);
  }

  fs.writeFileSync(filePath, content);
  console.log('Processed', file);
}

controllers.forEach(processController);
