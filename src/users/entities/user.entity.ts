import { ImageEntity } from 'src/images/entities/image.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  email: string;

  @Column()
  password?: string;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ImageEntity, (image) => image.user)
  avatar: ImageEntity[];
}
