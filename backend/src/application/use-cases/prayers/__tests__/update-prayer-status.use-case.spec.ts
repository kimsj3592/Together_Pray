import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdatePrayerStatusUseCase } from '../update-prayer-status.use-case';
import { PRAYER_ITEM_REPOSITORY } from '../../../../core/repositories/prayer-item.repository.interface';
import { GROUP_MEMBER_REPOSITORY } from '../../../../core/repositories/group-member.repository.interface';
import { PrayerStatus } from '../../../../core/entities/prayer-item.entity';

describe('UpdatePrayerStatusUseCase', () => {
  let useCase: UpdatePrayerStatusUseCase;

  const mockPrayerItemRepository = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockGroupMemberRepository = {
    isAdmin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePrayerStatusUseCase,
        { provide: PRAYER_ITEM_REPOSITORY, useValue: mockPrayerItemRepository },
        { provide: GROUP_MEMBER_REPOSITORY, useValue: mockGroupMemberRepository },
      ],
    }).compile();

    useCase = module.get<UpdatePrayerStatusUseCase>(UpdatePrayerStatusUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const prayerItemId = 'prayer-789';
    const groupId = 'group-456';

    const mockPrayerItem = {
      id: prayerItemId,
      groupId,
      authorId: 'author-id',
      title: 'Test Prayer',
      content: 'Content',
      category: null,
      status: PrayerStatus.PRAYING,
      isAnonymous: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 'author-id', name: 'Author Name' },
      _count: { reactions: 5, comments: 2 },
    };

    it('should update status when user is author', async () => {
      const userId = 'author-id';
      const dto = { status: PrayerStatus.ANSWERED };

      mockPrayerItemRepository.findById.mockResolvedValue(mockPrayerItem);
      mockGroupMemberRepository.isAdmin.mockResolvedValue(false);

      const updatedItem = { ...mockPrayerItem, status: PrayerStatus.ANSWERED };
      mockPrayerItemRepository.updateStatus.mockResolvedValue(updatedItem);

      const result = await useCase.execute({ userId, prayerItemId, dto });

      expect(mockPrayerItemRepository.updateStatus).toHaveBeenCalledWith(
        prayerItemId,
        PrayerStatus.ANSWERED,
      );
      expect(result.status).toBe(PrayerStatus.ANSWERED);
    });

    it('should update status when user is group admin', async () => {
      const userId = 'admin-id';
      const dto = { status: PrayerStatus.PARTIAL_ANSWER };

      mockPrayerItemRepository.findById.mockResolvedValue(mockPrayerItem);
      mockGroupMemberRepository.isAdmin.mockResolvedValue(true);

      const updatedItem = { ...mockPrayerItem, status: PrayerStatus.PARTIAL_ANSWER };
      mockPrayerItemRepository.updateStatus.mockResolvedValue(updatedItem);

      const result = await useCase.execute({ userId, prayerItemId, dto });

      expect(result.status).toBe(PrayerStatus.PARTIAL_ANSWER);
    });

    it('should throw NotFoundException when prayer item does not exist', async () => {
      const userId = 'user-id';
      const dto = { status: PrayerStatus.ANSWERED };

      mockPrayerItemRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ userId, prayerItemId, dto }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not author or admin', async () => {
      const userId = 'other-user-id';
      const dto = { status: PrayerStatus.ANSWERED };

      mockPrayerItemRepository.findById.mockResolvedValue(mockPrayerItem);
      mockGroupMemberRepository.isAdmin.mockResolvedValue(false);

      await expect(
        useCase.execute({ userId, prayerItemId, dto }),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrayerItemRepository.updateStatus).not.toHaveBeenCalled();
    });
  });
});
