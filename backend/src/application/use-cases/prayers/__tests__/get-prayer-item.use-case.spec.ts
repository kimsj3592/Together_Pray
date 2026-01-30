import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetPrayerItemUseCase } from '../get-prayer-item.use-case';
import { PRAYER_ITEM_REPOSITORY } from '../../../../core/repositories/prayer-item.repository.interface';
import { GROUP_MEMBER_REPOSITORY } from '../../../../core/repositories/group-member.repository.interface';
import { PrayerStatus } from '../../../../core/entities/prayer-item.entity';

describe('GetPrayerItemUseCase', () => {
  let useCase: GetPrayerItemUseCase;

  const mockPrayerItemRepository = {
    findByIdWithGroup: jest.fn(),
    hasUserReactedToday: jest.fn(),
  };

  const mockGroupMemberRepository = {
    isMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPrayerItemUseCase,
        { provide: PRAYER_ITEM_REPOSITORY, useValue: mockPrayerItemRepository },
        { provide: GROUP_MEMBER_REPOSITORY, useValue: mockGroupMemberRepository },
      ],
    }).compile();

    useCase = module.get<GetPrayerItemUseCase>(GetPrayerItemUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const userId = 'user-123';
    const prayerItemId = 'prayer-789';
    const groupId = 'group-456';

    const mockPrayerItem = {
      id: prayerItemId,
      groupId,
      authorId: 'author-id',
      title: 'Test Prayer',
      content: 'Prayer content',
      category: null,
      status: PrayerStatus.PRAYING,
      isAnonymous: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 'author-id', name: 'Author Name' },
      group: { id: groupId, name: 'Test Group' },
      _count: { reactions: 5, comments: 2, updates: 1 },
    };

    it('should return prayer item details', async () => {
      mockPrayerItemRepository.findByIdWithGroup.mockResolvedValue(mockPrayerItem);
      mockGroupMemberRepository.isMember.mockResolvedValue(true);
      mockPrayerItemRepository.hasUserReactedToday.mockResolvedValue(false);

      const result = await useCase.execute({ userId, prayerItemId });

      expect(mockPrayerItemRepository.findByIdWithGroup).toHaveBeenCalledWith(prayerItemId);
      expect(mockGroupMemberRepository.isMember).toHaveBeenCalledWith(userId, groupId);
      expect(result.id).toBe(prayerItemId);
      expect(result.hasPrayedToday).toBe(false);
    });

    it('should throw NotFoundException when prayer item does not exist', async () => {
      mockPrayerItemRepository.findByIdWithGroup.mockResolvedValue(null);

      await expect(
        useCase.execute({ userId, prayerItemId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not a group member', async () => {
      mockPrayerItemRepository.findByIdWithGroup.mockResolvedValue(mockPrayerItem);
      mockGroupMemberRepository.isMember.mockResolvedValue(false);

      await expect(
        useCase.execute({ userId, prayerItemId }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should indicate hasPrayedToday when user has reacted', async () => {
      mockPrayerItemRepository.findByIdWithGroup.mockResolvedValue(mockPrayerItem);
      mockGroupMemberRepository.isMember.mockResolvedValue(true);
      mockPrayerItemRepository.hasUserReactedToday.mockResolvedValue(true);

      const result = await useCase.execute({ userId, prayerItemId });

      expect(result.hasPrayedToday).toBe(true);
    });

    it('should hide author name for anonymous posts viewed by non-author', async () => {
      const anonymousPrayerItem = {
        ...mockPrayerItem,
        isAnonymous: true,
      };

      mockPrayerItemRepository.findByIdWithGroup.mockResolvedValue(anonymousPrayerItem);
      mockGroupMemberRepository.isMember.mockResolvedValue(true);
      mockPrayerItemRepository.hasUserReactedToday.mockResolvedValue(false);

      const result = await useCase.execute({ userId, prayerItemId });

      expect(result.author.name).toBe('익명');
      expect(result.author.id).toBeNull();
    });

    it('should show author name for anonymous posts viewed by author', async () => {
      const anonymousPrayerItem = {
        ...mockPrayerItem,
        authorId: userId,
        isAnonymous: true,
        author: { id: userId, name: 'My Name' },
      };

      mockPrayerItemRepository.findByIdWithGroup.mockResolvedValue(anonymousPrayerItem);
      mockGroupMemberRepository.isMember.mockResolvedValue(true);
      mockPrayerItemRepository.hasUserReactedToday.mockResolvedValue(false);

      const result = await useCase.execute({ userId, prayerItemId });

      expect(result.author.name).toBe('My Name');
      expect(result.isAuthor).toBe(true);
    });
  });
});
