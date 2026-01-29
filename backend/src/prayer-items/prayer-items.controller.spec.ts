import { Test, TestingModule } from '@nestjs/testing';
import { PrayerItemsController } from './prayer-items.controller';
import { PrayerItemsService } from './prayer-items.service';
import { CreatePrayerItemDto } from './dto/create-prayer-item.dto';
import { UpdatePrayerStatusDto } from './dto/update-prayer-status.dto';
import { PrayerStatus } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PrayerItemsController', () => {
  let controller: PrayerItemsController;
  let prayerItemsService: PrayerItemsService;

  const mockPrayerItemsService = {
    create: jest.fn(),
    findAllByGroup: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayerItemsController],
      providers: [
        {
          provide: PrayerItemsService,
          useValue: mockPrayerItemsService,
        },
      ],
    }).compile();

    controller = module.get<PrayerItemsController>(PrayerItemsController);
    prayerItemsService = module.get<PrayerItemsService>(PrayerItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new prayer item', async () => {
      const req = { user: { id: 'user-id' } };
      const createDto: CreatePrayerItemDto = {
        groupId: 'group-id',
        title: 'Test Prayer',
        content: 'Please pray for this',
        isAnonymous: false,
      };

      const expectedResult = {
        id: 'prayer-id',
        title: 'Test Prayer',
        content: 'Please pray for this',
        status: PrayerStatus.praying,
        isAnonymous: false,
        author: {
          id: 'user-id',
          name: 'Test User',
        },
        createdAt: new Date(),
      };

      mockPrayerItemsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(req, createDto);

      expect(result).toEqual(expectedResult);
      expect(prayerItemsService.create).toHaveBeenCalledWith('user-id', createDto);
    });

    it('should create anonymous prayer item', async () => {
      const req = { user: { id: 'user-id' } };
      const createDto: CreatePrayerItemDto = {
        groupId: 'group-id',
        title: 'Anonymous Prayer',
        content: 'Please pray',
        isAnonymous: true,
      };

      const expectedResult = {
        id: 'prayer-id',
        title: 'Anonymous Prayer',
        content: 'Please pray',
        status: PrayerStatus.praying,
        isAnonymous: true,
        author: {
          name: '익명',
        },
        createdAt: new Date(),
      };

      mockPrayerItemsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(req, createDto);

      expect(result.isAnonymous).toBe(true);
      expect(result.author.name).toBe('익명');
    });
  });

  describe('findAllByGroup', () => {
    it('should return paginated prayer items', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';

      const expectedResult = {
        items: [
          {
            id: 'prayer-1',
            title: 'Prayer 1',
            status: PrayerStatus.praying,
          },
          {
            id: 'prayer-2',
            title: 'Prayer 2',
            status: PrayerStatus.praying,
          },
        ],
        total: 2,
        page: 1,
        limit: 20,
      };

      mockPrayerItemsService.findAllByGroup.mockResolvedValue(expectedResult);

      const result = await controller.findAllByGroup(groupId, req);

      expect(result).toEqual(expectedResult);
      expect(prayerItemsService.findAllByGroup).toHaveBeenCalledWith(
        groupId,
        'user-id',
        undefined,
        1,
        20,
      );
    });

    it('should filter by status', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';
      const status = PrayerStatus.answered;

      const expectedResult = {
        items: [
          {
            id: 'prayer-1',
            title: 'Answered Prayer',
            status: PrayerStatus.answered,
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      mockPrayerItemsService.findAllByGroup.mockResolvedValue(expectedResult);

      const result = await controller.findAllByGroup(
        groupId,
        req,
        status,
        '1',
        '20',
      );

      expect(prayerItemsService.findAllByGroup).toHaveBeenCalledWith(
        groupId,
        'user-id',
        status,
        1,
        20,
      );
    });

    it('should support custom pagination', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';

      mockPrayerItemsService.findAllByGroup.mockResolvedValue({
        items: [],
        total: 0,
        page: 2,
        limit: 10,
      });

      await controller.findAllByGroup(groupId, req, undefined, '2', '10');

      expect(prayerItemsService.findAllByGroup).toHaveBeenCalledWith(
        groupId,
        'user-id',
        undefined,
        2,
        10,
      );
    });
  });

  describe('findOne', () => {
    it('should return prayer item details', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'prayer-id';

      const expectedResult = {
        id: prayerId,
        title: 'Test Prayer',
        content: 'Please pray for this',
        status: PrayerStatus.praying,
        author: {
          id: 'user-id',
          name: 'Test User',
        },
        prayerCount: 5,
        createdAt: new Date(),
      };

      mockPrayerItemsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(prayerId, req);

      expect(result).toEqual(expectedResult);
      expect(prayerItemsService.findOne).toHaveBeenCalledWith(
        prayerId,
        'user-id',
      );
    });

    it('should hide author for anonymous prayers', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'prayer-id';

      const expectedResult = {
        id: prayerId,
        title: 'Anonymous Prayer',
        isAnonymous: true,
        author: {
          name: '익명',
        },
      };

      mockPrayerItemsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(prayerId, req);

      expect(result.author.name).toBe('익명');
    });

    it('should throw NotFoundException when prayer does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'non-existent-id';

      mockPrayerItemsService.findOne.mockRejectedValue(
        new NotFoundException('Prayer item not found'),
      );

      await expect(controller.findOne(prayerId, req)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update prayer status', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'prayer-id';
      const updateDto: UpdatePrayerStatusDto = {
        status: PrayerStatus.answered,
      };

      const expectedResult = {
        id: prayerId,
        status: PrayerStatus.answered,
        updatedAt: new Date(),
      };

      mockPrayerItemsService.updateStatus.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus(prayerId, req, updateDto);

      expect(result).toEqual(expectedResult);
      expect(prayerItemsService.updateStatus).toHaveBeenCalledWith(
        prayerId,
        'user-id',
        updateDto,
      );
    });

    it('should allow status change to PARTIALLY_ANSWERED', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'prayer-id';
      const updateDto: UpdatePrayerStatusDto = {
        status: PrayerStatus.partial_answer,
      };

      const expectedResult = {
        id: prayerId,
        status: PrayerStatus.partial_answer,
      };

      mockPrayerItemsService.updateStatus.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus(prayerId, req, updateDto);

      expect(result.status).toBe(PrayerStatus.partial_answer);
    });

    it('should throw ForbiddenException when user is not author', async () => {
      const req = { user: { id: 'other-user-id' } };
      const prayerId = 'prayer-id';
      const updateDto: UpdatePrayerStatusDto = {
        status: PrayerStatus.answered,
      };

      mockPrayerItemsService.updateStatus.mockRejectedValue(
        new ForbiddenException('Only author can update status'),
      );

      await expect(
        controller.updateStatus(prayerId, req, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete prayer item', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'prayer-id';

      mockPrayerItemsService.delete.mockResolvedValue({
        message: 'Prayer item deleted',
      });

      const result = await controller.delete(prayerId, req);

      expect(result).toEqual({ message: 'Prayer item deleted' });
      expect(prayerItemsService.delete).toHaveBeenCalledWith(
        prayerId,
        'user-id',
      );
    });

    it('should throw ForbiddenException when user is not author', async () => {
      const req = { user: { id: 'other-user-id' } };
      const prayerId = 'prayer-id';

      mockPrayerItemsService.delete.mockRejectedValue(
        new ForbiddenException('Only author can delete'),
      );

      await expect(controller.delete(prayerId, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when prayer does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'non-existent-id';

      mockPrayerItemsService.delete.mockRejectedValue(
        new NotFoundException('Prayer item not found'),
      );

      await expect(controller.delete(prayerId, req)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
