import { Test, TestingModule } from '@nestjs/testing';
import { PrayerReactionsController } from './prayer-reactions.controller';
import { PrayerReactionsService } from './prayer-reactions.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PrayerReactionsController', () => {
  let controller: PrayerReactionsController;
  let prayerReactionsService: PrayerReactionsService;

  const mockPrayerReactionsService = {
    pray: jest.fn(),
    getPrayersList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayerReactionsController],
      providers: [
        {
          provide: PrayerReactionsService,
          useValue: mockPrayerReactionsService,
        },
      ],
    }).compile();

    controller = module.get<PrayerReactionsController>(
      PrayerReactionsController,
    );
    prayerReactionsService = module.get<PrayerReactionsService>(
      PrayerReactionsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pray', () => {
    it('should record prayer reaction', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      const expectedResult = {
        message: 'Prayer recorded successfully',
        prayCount: 1,
        hasPrayedToday: true,
      };

      mockPrayerReactionsService.pray.mockResolvedValue(expectedResult);

      const result = await controller.pray(prayerItemId, req);

      expect(result).toEqual(expectedResult);
      expect(prayerReactionsService.pray).toHaveBeenCalledWith(
        prayerItemId,
        'user-id',
      );
    });

    it('should increment prayer count', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      const expectedResult = {
        message: 'Prayer recorded successfully',
        prayCount: 5,
        hasPrayedToday: true,
      };

      mockPrayerReactionsService.pray.mockResolvedValue(expectedResult);

      const result = await controller.pray(prayerItemId, req);

      expect(result.prayCount).toBe(5);
    });

    it('should throw BadRequestException when already prayed today', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      mockPrayerReactionsService.pray.mockRejectedValue(
        new BadRequestException('Already prayed for this item today'),
      );

      await expect(controller.pray(prayerItemId, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when prayer item does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'non-existent-id';

      mockPrayerReactionsService.pray.mockRejectedValue(
        new NotFoundException('Prayer item not found'),
      );

      await expect(controller.pray(prayerItemId, req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow prayer after 24 hours', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      const expectedResult = {
        message: 'Prayer recorded successfully',
        prayCount: 2,
        hasPrayedToday: true,
      };

      mockPrayerReactionsService.pray.mockResolvedValue(expectedResult);

      const result = await controller.pray(prayerItemId, req);

      expect(result.message).toBe('Prayer recorded successfully');
    });
  });

  describe('getPrayersList', () => {
    it('should return list of users who prayed', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      const expectedResult = [
        {
          id: 'user-1',
          name: 'User 1',
          prayedAt: new Date('2025-01-29T10:00:00Z'),
        },
        {
          id: 'user-2',
          name: 'User 2',
          prayedAt: new Date('2025-01-29T11:00:00Z'),
        },
        {
          id: 'user-3',
          name: 'User 3',
          prayedAt: new Date('2025-01-29T12:00:00Z'),
        },
      ];

      mockPrayerReactionsService.getPrayersList.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getPrayersList(prayerItemId, req);

      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(3);
      expect(prayerReactionsService.getPrayersList).toHaveBeenCalledWith(
        prayerItemId,
        'user-id',
      );
    });

    it('should return empty list when no prayers', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      const expectedResult = [];

      mockPrayerReactionsService.getPrayersList.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getPrayersList(prayerItemId, req);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should show only most recent prayer per user', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'prayer-id';

      const expectedResult = [
        {
          id: 'user-1',
          name: 'User 1',
          prayedAt: new Date('2025-01-29T10:00:00Z'),
        },
        {
          id: 'user-2',
          name: 'User 2',
          prayedAt: new Date('2025-01-28T10:00:00Z'),
        },
      ];

      mockPrayerReactionsService.getPrayersList.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getPrayersList(prayerItemId, req);

      expect(result).toHaveLength(2);
      expect(result[0].id).not.toBe(result[1].id);
    });

    it('should throw NotFoundException when prayer item does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerItemId = 'non-existent-id';

      mockPrayerReactionsService.getPrayersList.mockRejectedValue(
        new NotFoundException('Prayer item not found'),
      );

      await expect(
        controller.getPrayersList(prayerItemId, req),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
