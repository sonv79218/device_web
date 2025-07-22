import { Test, TestingModule } from '@nestjs/testing';
import { BorrowRequestController } from './borrow-request.controller';
import { BorrowRequestService } from './borrow-request.service';

describe('BorrowRequestController', () => {
  let controller: BorrowRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowRequestController],
      providers: [BorrowRequestService],
    }).compile();

    controller = module.get<BorrowRequestController>(BorrowRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
