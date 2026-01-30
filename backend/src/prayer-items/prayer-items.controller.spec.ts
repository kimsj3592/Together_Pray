import { Test, TestingModule } from '@nestjs/testing';
import { PrayerItemsController } from '../presentation/controllers/prayer-items.controller';
import { PrayerItemsService } from './prayer-items.service';
import { CreatePrayerItemDto } from '../application/dtos/prayers/create-prayer-item.dto';
import { UpdatePrayerStatusDto } from '../application/dtos/prayers/update-prayer-status.dto';
import { PrayerStatus } from '../core/entities/prayer-item.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePrayerItemUseCase } from '../application/use-cases/prayers/create-prayer-item.use-case';
import { GetPrayerItemsByGroupUseCase } from '../application/use-cases/prayers/get-prayer-items-by-group.use-case';
import { GetPrayerItemUseCase } from '../application/use-cases/prayers/get-prayer-item.use-case';
import { UpdatePrayerStatusUseCase } from '../application/use-cases/prayers/update-prayer-status.use-case';
import { DeletePrayerItemUseCase } from '../application/use-cases/prayers/delete-prayer-item.use-case';

describe('PrayerItemsController', () => {
  let controller: PrayerItemsController;

  const mockCreatePrayerItemUseCase = { execute: jest.fn() };
  const mockGetPrayerItemsByGroupUseCase = { execute: jest.fn() };
  const mockGetPrayerItemUseCase = { execute: jest.fn() };
  const mockUpdatePrayerStatusUseCase = { execute: jest.fn() };
  const mockDeletePrayerItemUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayerItemsController],
      providers: [
        { provide: CreatePrayerItemUseCase, useValue: mockCreatePrayerItemUseCase },
        { provide: GetPrayerItemsByGroupUseCase, useValue: mockGetPrayerItemsByGroupUseCase },
        { provide: GetPrayerItemUseCase, useValue: mockGetPrayerItemUseCase },
        { provide: UpdatePrayerStatusUseCase, useValue: mockUpdatePrayerStatusUseCase },
        { provide: DeletePrayerItemUseCase, useValue: mockDeletePrayerItemUseCase },
      ],
    }).compile();

    controller = module.get<PrayerItemsController>(PrayerItemsController);
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
        status: PrayerStatus.PRAYING,
        isAnonymous: false,
        author: {
          id: 'user-id',
          name: 'Test User',
        },
        createdAt: new Date(),
      };

      mockCreatePrayerItemUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.create(req, createDto);

      expect(result).toEqual(expectedResult);
      expect(mockCreatePrayerItemUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        dto: createDto,
      });
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
        status: PrayerStatus.PRAYING,
        isAnonymous: true,
        author: {
          name: '익명',
        },
        createdAt: new Date(),
      };

      mockCreatePrayerItemUseCase.execute.mockResolvedValue(expectedResult);

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
            status: PrayerStatus.PRAYING,
          },
          {
            id: 'prayer-2',
            title: 'Prayer 2',
            status: PrayerStatus.PRAYING,
          },
        ],
        total: 2,
        page: 1,
        limit: 20,
      };

      mockGetPrayerItemsByGroupUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findAllByGroup(groupId, req);

      expect(result).toEqual(expectedResult);
      expect(mockGetPrayerItemsByGroupUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        groupId,
        status: undefined,
        page: 1,
        limit: 20,
      });
    });

    it('should filter by status', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';
      const status = PrayerStatus.ANSWERED;

      const expectedResult = {
        items: [
          {
            id: 'prayer-1',
            title: 'Answered Prayer',
            status: PrayerStatus.ANSWERED,
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      mockGetPrayerItemsByGroupUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findAllByGroup(
        groupId,
        req,
        status,
        '1',
        '20',
      );

      expect(mockGetPrayerItemsByGroupUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        groupId,
        status,
        page: 1,
        limit: 20,
      });
    });

    it('should support custom pagination', async () => {
      const req = { user: { id: 'user-id' } };
      const groupId = 'group-id';

      mockGetPrayerItemsByGroupUseCase.execute.mockResolvedValue({
        items: [],
        total: 0,
        page: 2,
        limit: 10,
      });

      await controller.findAllByGroup(groupId, req, undefined, '2', '10');

      expect(mockGetPrayerItemsByGroupUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        groupId,
        status: undefined,
        page: 2,
        limit: 10,
      });
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
        status: PrayerStatus.PRAYING,
        author: {
          id: 'user-id',
          name: 'Test User',
        },
        prayerCount: 5,
        createdAt: new Date(),
      };

      mockGetPrayerItemUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findOne(prayerId, req);

      expect(result).toEqual(expectedResult);
      expect(mockGetPrayerItemUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        prayerItemId: prayerId,
      });
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

      mockGetPrayerItemUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findOne(prayerId, req);

      expect(result.author.name).toBe('익명');
    });

    it('should throw NotFoundException when prayer does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'non-existent-id';

      mockGetPrayerItemUseCase.execute.mockRejectedValue(
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
        status: PrayerStatus.ANSWERED,
      };

      const expectedResult = {
        id: prayerId,
        status: PrayerStatus.ANSWERED,
        updatedAt: new Date(),
      };

      mockUpdatePrayerStatusUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus(prayerId, req, updateDto);

      expect(result).toEqual(expectedResult);
      expect(mockUpdatePrayerStatusUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        prayerItemId: prayerId,
        dto: updateDto,
      });
    });

    it('should allow status change to PARTIAL_ANSWER', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'prayer-id';
      const updateDto: UpdatePrayerStatusDto = {
        status: PrayerStatus.PARTIAL_ANSWER,
      };

      const expectedResult = {
        id: prayerId,
        status: PrayerStatus.PARTIAL_ANSWER,
      };

      mockUpdatePrayerStatusUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus(prayerId, req, updateDto);

      expect(result.status).toBe(PrayerStatus.PARTIAL_ANSWER);
    });

    it('should throw ForbiddenException when user is not author', async () => {
      const req = { user: { id: 'other-user-id' } };
      const prayerId = 'prayer-id';
      const updateDto: UpdatePrayerStatusDto = {
        status: PrayerStatus.ANSWERED,
      };

      mockUpdatePrayerStatusUseCase.execute.mockRejectedValue(
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

      mockDeletePrayerItemUseCase.execute.mockResolvedValue({
        message: 'Prayer item deleted',
      });

      const result = await controller.delete(prayerId, req);

      expect(result).toEqual({ message: 'Prayer item deleted' });
      expect(mockDeletePrayerItemUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id',
        prayerItemId: prayerId,
      });
    });

    it('should throw ForbiddenException when user is not author', async () => {
      const req = { user: { id: 'other-user-id' } };
      const prayerId = 'prayer-id';

      mockDeletePrayerItemUseCase.execute.mockRejectedValue(
        new ForbiddenException('Only author can delete'),
      );

      await expect(controller.delete(prayerId, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when prayer does not exist', async () => {
      const req = { user: { id: 'user-id' } };
      const prayerId = 'non-existent-id';

      mockDeletePrayerItemUseCase.execute.mockRejectedValue(
        new NotFoundException('Prayer item not found'),
      );

      await expect(controller.delete(prayerId, req)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
