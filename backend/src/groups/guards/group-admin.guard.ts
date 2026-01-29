import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GroupsService } from '../groups.service';

@Injectable()
export class GroupAdminGuard implements CanActivate {
  constructor(private groupsService: GroupsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.id || request.params.groupId;

    if (!user || !groupId) {
      throw new ForbiddenException('Access denied');
    }

    const isAdmin = await this.groupsService.isAdmin(groupId, user.id);

    if (!isAdmin) {
      throw new ForbiddenException('Only group admins can perform this action');
    }

    return true;
  }
}
