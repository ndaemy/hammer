import { addDays } from "date-fns";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";

interface InputData {
  token: string;
  user: User;
}

// TODO: 이 Entity는 추후 redis로 바뀌어야 함

@Entity()
class EmailVerifyToken extends BaseEntity {
  public constructor(data?: InputData) {
    super();
    if (data) {
      this.token = data.token;
      this.user = data.user;
      // TODO: 이러면 timezone을 포함해서 date가 들어감; 한국 기준 +9
      // 추후 redis로 바꿀 때 고민 필요
      this.expiredAt = addDays(new Date(), 1);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column()
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default EmailVerifyToken;
