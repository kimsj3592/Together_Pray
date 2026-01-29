import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GroupsService } from '../groups.service';

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(private groupsService: GroupsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.id || request.params.groupId;

    if (!user || !groupId) {
      throw new ForbiddenException('Access denied');
    }

    const isMember = await this.groupsService.checkMembership(
      groupId,
      user.id,
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return true;
  }
}
