import { Controller, Get, Post, Patch, Body, Param , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { NotificationService } from './notification.service';
import { NotificationType } from '../../common/enums/notification_type.enum';

/**
 * NotificationController
 * API endpoints for managing notifications.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('user/:userId')
    async sendNotification(
        @Param('userId') userId: string,
        @Body('title') title: string,
        @Body('message') message: string,
        @Body('type') type: NotificationType
    ) {
        return this.notificationService.sendNotification(
            { userId: +userId } as any,
            title,
            message,
            type
        );
    }

    @Get('user/:userId')
    async getUserNotifications(@Param('userId') userId: string) {
        return this.notificationService.getNotificationsByUser(+userId);
    }

    @Patch(':notificationId/read')
    async markAsRead(@Param('notificationId') notificationId: string) {
        return this.notificationService.markAsRead(+notificationId);
    }
}
