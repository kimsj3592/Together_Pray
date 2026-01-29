import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('GroupsController', () => {
  let controller: GroupsController;
  let groupsService: GroupsService;

  const mockGroupsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    joinByInviteCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: mockGroupsService,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    groupsService = module.get<GroupsService>(GroupsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new group', async () => {
      const req = { user: { id: 'user-id' } };
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
      };

      const expectedResult = {
        id: 'group-id',
        name: 'Test Group',
        description: 'Test Description',
        inviteCode: 'ABCD1234',
        createdAt: new Date(),
      };

      mockGroupsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(req, createGroupDto);

      expect(result).toEqual(expectedResult);
      expect(groupsService.create).toHaveBeenCalledWith(
        'user-id',
        createGroupDto,
      );
    });

    it('should generate unique invite code for group', async () => {
      const req = { user: { id: 'user-id' } };
      const createGroupDto: CreateGroupDto = {
        name: 'Another Group',
        description: 'Description',
      };

      const result = {
        id: 'group-id-2',
        name: 'Another Group',
        inviteCode: 'XYZ98765',
        createdAt: new Date(),
      };

      mockGroupsService.create.mockResolvedValue(result);

      const createdGroup = await controller.create(req, createGroupDto);

      expect(createdGroup.inviteCode).toBeDefined();
      expect(createdGroup.inviteCode.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('findAll', () => {
    it('should return all groups for user', async () => {
      const req = { user: { id: 'user-id' } };

      const expectedResult = [
        {
          id: 'group-1',
          name: 'Group 1',
          description: 'Description 1',
          role: 'ADMIN',
        },
        {
          id: 'group-2',
          name: 'Group 2',
          description: 'Description 2',
          role: 'MEMBER',
        },
      ];

      mockGroupsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(req);

      expect(result).toEqual(expectedResult);
      expect(groupsService.findAll).toHaveBeenCalledWith('user-id');
    });

    it('should return empty array when user has no groups', async () => {
      const req = { user: { id: 'user-id' } };

      mockGroupsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(req);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return group details', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';

      const expectedResult = {
        id: groupId,
        name: 'Test Group',
        description: 'Test Description',
        members: [
          { userId: 'user-id', role: 'ADMIN', name: 'Test User' },
        ],
      };

      mockGroupsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(groupId, req);

      expect(result).toEqual(expectedResult);
      expect(groupsService.findOne).toHaveBeenCalledWith(groupId, 'user-id');
    });

    it('should throw NotFoundException when group does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'non-existent-id';

      mockGroupsService.findOne.mockRejectedValue(
        new NotFoundException('Group not found'),
      );

      await expect(controller.findOne(groupId, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';

      mockGroupsService.findOne.mockRejectedValue(
        new ForbiddenException('Not a member of this group'),
      );

      await expect(controller.findOne(groupId, req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('join', () => {
    it('should join group with valid invite code', async () => {
      const req = { user: { id: 'user-id' } };
      const joinGroupDto: JoinGroupDto = {
        inviteCode: 'ABCD1234',
      };

      const expectedResult = {
        id: 'group-id',
        name: 'Test Group',
        description: 'Test Description',
        role: 'MEMBER',
      };

      mockGroupsService.joinByInviteCode.mockResolvedValue(expectedResult);

      const result = await controller.join(req, joinGroupDto);

      expect(result).toEqual(expectedResult);
      expect(groupsService.joinByInviteCode).toHaveBeenCalledWith(
        'user-id',
        'ABCD1234',
      );
    });

    it('should throw error for invalid invite code', async () => {
      const req = { user: { id: 'user-id' } };
      const joinGroupDto: JoinGroupDto = {
        inviteCode: 'INVALID',
      };

      mockGroupsService.joinByInviteCode.mockRejectedValue(
        new NotFoundException('Invalid invite code'),
      );

      await expect(controller.join(req, joinGroupDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should prevent duplicate group membership', async () => {
      const req = { user: { id: 'user-id' } };
      const joinGroupDto: JoinGroupDto = {
        inviteCode: 'ABCD1234',
      };

      mockGroupsService.joinByInviteCode.mockRejectedValue(
        new Error('Already a member of this group'),
      );

      await expect(controller.join(req, joinGroupDto)).rejects.toThrow(
        'Already a member of this group',
      );
    });
  });
});
