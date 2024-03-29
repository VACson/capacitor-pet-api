import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from 'src/images/entities/image.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private activityRepository: Repository<ActivityEntity>,
    private usersService: UsersService,
  ) {}

  async create(userUuid: string, createActivityDto: CreateActivityDto) {
    const user = await this.usersService.findById(userUuid);

    return this.activityRepository.save({
      ...createActivityDto,
      activity_creator: user,
    });
  }

  async findAll({ limit = 10, offset = 0 } = {}): Promise<ActivityEntity[]> {
    return this.activityRepository.find({
      relations: ['activity_creator', 'activity_images'],
      take: limit,
      skip: offset,
    });
  }

  async findUserCreatedEvents(userUuid: string): Promise<ActivityEntity[]> {
    const user = await this.usersService.findById(userUuid);

    return this.activityRepository.find({ where: { activity_creator: user } });
  }

  findById(activity_uuid: string): Promise<ActivityEntity> {
    return this.activityRepository.findOneBy({ activity_uuid });
  }

  async update(
    activity_uuid: string,
    dto: UpdateActivityDto,
  ): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findOneBy({ activity_uuid });

    if (!activity) {
      throw new NotFoundException('Event not found');
    }

    Object.assign(activity, dto);

    return this.activityRepository.save(activity);
  }

  async addActivityImage(
    activity_uuid: string,
    image: ImageEntity,
  ): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findOne({
      where: { activity_uuid },
      relations: ['activity_images'],
    });

    if (!activity) {
      throw new NotFoundException('User not found');
    }

    activity.activity_images.push(image);
    return this.activityRepository.save(activity);
  }

  remove(activity_uuid: string) {
    return `This action removes a #${activity_uuid} activity`;
  }
}
