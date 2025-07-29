import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRequest } from './entities/borrow-request.entity';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { BadRequestException,ForbiddenException } from '@nestjs/common';
@Injectable()//dùng để đánh dấu class là provider
export class BorrowRequestService {
  constructor(
    
    @InjectRepository(BorrowRequest) //dùng để inject Repository của một entity (TypeORM)
    private borrowRequestRepo: Repository<BorrowRequest>, 
//cấp quyền truy cập kho dữ liệu User từ hệ thống TypeORM -> sau đó có thể truy cập  this.userRepo.find(), save(), delete()...
    @InjectRepository(User)
    private userRepo: Repository<User>,// sử dụng tìm người dùng dựa vào id

    @InjectRepository(Product)
    private productRepo: Repository<Product>,// sử dụng để tìm sản phẩm dựa vào id 
  ) {}
  // tạo yêu cầu mượn 
  // truyền vào deviceId và userId; kiểm tra tồn tại, kiểm tra đã mượn chưa, nếu chưa thì gửi yêu cầu mượn
  async create(dto: CreateBorrowRequestDto, deviceId: string, userId: string) {
    // tìm xem có id-device nào phù hợp với id-device truyền vào k - phải là kiểu uuid 
    const device = await this.productRepo.findOneBy({ device_id: deviceId });
      if (!device) {
    throw new NotFoundException('Device not found');
  }
// kiểm tra có user hợp lệ k
      const user_id = await this.userRepo.findOneBy({ id: userId });
      if (!user_id) {
    throw new NotFoundException('User not found');
  }
  
// Kiểm tra nếu đã có yêu cầu mượn đang chờ xử lý cho thiết bị này từ người dùng này
  const existing = await this.borrowRequestRepo.findOne({
    where: {
      user: { id: userId },
      product: { device_id: deviceId },
      status: 'pending',
    },
    relations: ['user', 'product'], // đảm bảo có thể truy cập user.id và device.id
  });

  if (existing) {
    throw new BadRequestException('Bạn đã gửi yêu cầu mượn thiết bị này rồi và đang chờ xử lý');
  }
  const newRequest = this.borrowRequestRepo.create({
    ...dto,
    product: { device_id: device.device_id },
    user: { id: user_id.id }
    // user: user_id.id
  });
  return await this.borrowRequestRepo.save(newRequest);
}
// duyệt 
async approveRequest(borrowRequestId: string, userId: string){
    // tìm xem có request trong bảng k
  const request = await this.borrowRequestRepo.findOne({
    where: {
      id: borrowRequestId,
    },
    relations: ['user','product'],
  });

  if (!request) {
    throw new NotFoundException('Borrow request not found');
  }
  // // check userid 
  // if (request.user.id !== userId) {
  //   throw new ForbiddenException('You are not allowed to return this device');
  // }


  // chỉ có trạng thái là pending thì mới được chấp nhận 
// cập nhật status trong request
  // Tìm product liên quan
  // console.log(request.product.device_id);// không đọc được device id 
  const product = await this.productRepo.findOne({
    where: { device_id: request.product.device_id }, // hoặc request.productId
  });
    if (!product) {
    throw new NotFoundException('Product not found');
  }

// Nếu yêu cầu đã được chấp nhận hoặc từ chối rồi thì không được xử lý lại
if (request.status === 'approved') {
  throw new BadRequestException('Yêu cầu này đã được chấp nhận trước đó');
}

if (request.status === 'rejected') {
  throw new BadRequestException('Yêu cầu này đã bị từ chối');
}
if (request.status === 'returned') {
  throw new BadRequestException('người mượn đã mượn thành công và đã trả rồi');
}
if (request.status !== 'pending') {
  throw new BadRequestException('Only pending requests can be approved');
}
  // console.log(product.status);
  request.status = 'approved';
   await this.borrowRequestRepo.save(request);
    // Cập nhật trạng thái device
  // request.product.status = 'assigned'; // hoặc 'available' tuỳ logic của bạn
   product.status = 'assigned'; // hoặc 'assigned', tuỳ logic của bạn
  // request.returnedAt = new Date(); // nếu bạn có cột returnedAt
  await this.productRepo.save(product);
   return { message: 'yêu cầu được đồng ý và cập nhật trạng thái thiết bị là đã cho mượn' };
}
// duyệt 
async rejectRequest(borrowRequestId: string, userId: string){
  // tìm xem có request trong bảng k
  const request = await this.borrowRequestRepo.findOne({
    where: {
      id: borrowRequestId,
    },
    relations: ['user','product'],
  });

  if (!request) {
    throw new NotFoundException('Borrow request not found');
  }
// cập nhật status trong request
  // Tìm product liên quan
  const product = await this.productRepo.findOne({
    where: { device_id: request.product.device_id }, // hoặc request.productId
  });
    if (!product) {
    throw new NotFoundException('Product not found');
  }

// Nếu yêu cầu đã được chấp nhận hoặc từ chối rồi thì không được xử lý lại
if (request.status === 'approved') {
  throw new BadRequestException('Yêu cầu này đã được chấp nhận trước đó');
}
if (request.status === 'rejected') {
  throw new BadRequestException('Yêu cầu này đã bị từ chối');
}
if (request.status === 'returned') {
  throw new BadRequestException('Người mượn đã mượn thành công và đã trả rồi');
}
if (request.status !== 'pending') {
  throw new BadRequestException('Only pending requests can be rejected');
}

  request.status = 'rejected';
   await this.borrowRequestRepo.save(request);
   return { message: 'đã từ chối yêu cầu' };
}

// trả sản phẩm
async returnDeviceById(borrowRequestId: string, userId: string) {
  // tìm xem có request trong bảng k
  const request = await this.borrowRequestRepo.findOne({
    where: {
      id: borrowRequestId,
    },
    relations: ['user','product'],
  });

  if (!request) {
    throw new NotFoundException('Borrow request not found');
  }
  // check userid - người mượn mới được trả
  if (request.user.id !== userId) {
    throw new ForbiddenException('You are not allowed to return this device');
  }
  // Tìm product liên quan
  const product = await this.productRepo.findOne({
    where: { device_id: request.product.device_id }, // hoặc request.productId
  });
    if (!product) {
    throw new NotFoundException('Product not found');
  }
  // Nếu đã trả rồi thì không được trả tiếp
if (request.status === 'returned') {
  throw new BadRequestException('bạn đã trả rồi');
}
  request.status = 'returned';
  await this.borrowRequestRepo.save(request);
    // Cập nhật trạng thái device
   product.status = 'available'; 
  await this.productRepo.save(product);
  return { message: 'trả thành công và cập nhật trạng thái thiết bị là đã sẵn sàng' };
}

async findAll(): Promise<any[]> { // khai báo 1 hàm đồng bộ trả về mảng any 
  return await this.borrowRequestRepo // truy cập borrowRequestRepo 
    .createQueryBuilder('borrowRequest')
    .leftJoinAndSelect('borrowRequest.user', 'user')
    .leftJoinAndSelect('borrowRequest.product', 'product')
    .select([ // xác định các trường muốn lấy
      'borrowRequest',
      'user.id',
      'product.device_id'
    ])
    .getMany();
}

}
