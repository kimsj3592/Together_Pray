import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { CreatePrayerItemUseCase } from '../create-prayer-item.use-case';
import { PRAYER_ITEM_REPOSITORY } from '../../../../core/repositories/prayer-item.repository.interface';
import { GROUP_MEMBER_REPOSITORY } from '../../../../core/repositories/group-member.repository.interface';
import { PrayerStatus } from '../../../../core/entities/prayer-item.entity';

describe('CreatePrayerItemUseCase', () => {
  let useCase: CreatePrayerItemUseCase;

  const mockPrayerItemRepository = {
    create: jest.fn(),
  };

  const mockGroupMemberRepository = {
    isMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePrayerItemUseCase,
        { provide: PRAYER_ITEM_REPOSITORY, useValue: mockPrayerItemRepository },
        { provide: GROUP_MEMBER_REPOSITORY, useValue: mockGroupMemberRepository },
      ],
    }).compile();

    useCase = module.get<CreatePrayerItemUseCase>(CreatePrayerItemUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const userId = 'user-123';
    const groupId = 'group-456';

    it('should create a prayer item successfully', async () => {
      const dto = {
        groupId,
        title: 'Test Prayer',
        content: 'Please pray for this request',
        isAnonymous: false,
      };

      const createdItem = {
        id: 'prayer-789',
        groupId,
        authorId: userId,
        title: dto.title,
        content: dto.content,
        category: null,
        status: PrayerStatus.PRAYING,
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: userId, name: 'Test User' },
        _count: { reactions: 0, comments: 0 },
      };

      mockGroupMemberRepository.isMember.mockResolvedValue(true);
      mockPrayerItemRepository.create.mockResolvedValue(createdItem);

      const result = await useCase.execute({ userId, dto });

      expect(mockGroupMemberRepository.isMember).toHaveBeenCalledWith(userId, groupId);
      expect(mockPrayerItemRepository.create).toHaveBeenCalledWith({
        groupId,
        authorId: userId,
        title: dto.title,
        content: dto.content,
        category: undefined,
        isAnonymous: false,
      });
      expect(result.id).toBe('prayer-789');
      expect(result.isAuthor).toBe(true);
    });

    it('should throw ForbiddenException when user is not a group member', async () => {
      const dto = {
        groupId,
        title: 'Test Prayer',
        content: 'Please pray for this',
      };

      mockGroupMemberRepository.isMember.mockResolvedValue(false);

      await expect(useCase.execute({ userId, dto })).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrayerItemRepository.create).not.toHaveBeenCalled();
    });

    it('should hide author info for anonymous posts when viewed by others', async () => {
      const dto = {
        groupId,
        title: 'Anonymous Prayer',
        content: 'Please pray secretly',
        isAnonymous: true,
      };

      const createdItem = {
        id: 'prayer-789',
        groupId,
        authorId: userId,
        title: dto.title,
        content: dto.content,
        category: null,
        status: PrayerStatus.PRAYING,
        isAnonymous: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: userId, name: 'Test User' },
        _count: { reactions: 0, comments: 0 },
      };

      mockGroupMemberRepository.isMember.mockResolvedValue(true);
      mockPrayerItemRepository.create.mockResolvedValue(createdItem);

      const result = await useCase.execute({ userId, dto });

      // Author should see their own name
      expect(result.isAuthor).toBe(true);
      expect(result.author.name).toBe('Test User');
    });
  });
});
