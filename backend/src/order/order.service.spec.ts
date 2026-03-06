import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FILM_REPOSITORY_SERVICE } from './../../src/repository/repository.interface';
import { PostrgreSqlRepositoryService } from './../../src/repository/PostrgreSQLRepository/postrgre-sqlrepository.service';
import { orderMockResult, postOrderMock } from './order.fixtures';
import { BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let filmRepository: PostrgreSqlRepositoryService;

  beforeEach(async () => {
    filmRepository = {
      postOrder: jest.fn().mockResolvedValue(orderMockResult),
    } as unknown as PostrgreSqlRepositoryService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FILM_REPOSITORY_SERVICE,
          useValue: filmRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create order succesfully', async () => {
    const result = await service.postOrder(postOrderMock);
    expect(result).toEqual(orderMockResult);
  });

  it('should be reject order', async () => {
    const postOrderIncorrectSession = {
      ...postOrderMock,
      tickets: [],
    };
    // postOrderIncorrectSession.tickets = [];
    await expect(service.postOrder(postOrderIncorrectSession)).rejects.toThrow(
      BadRequestException,
    );
  });
});
