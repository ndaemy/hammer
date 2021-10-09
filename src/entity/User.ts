import { IsEmail, IsNotEmpty, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import ValidationEntity from "./ValidationEntity";

interface InputData {
  name: string;
  email: string;
  password: string;
}

@Entity()
class User extends ValidationEntity {
  public constructor(data?: InputData) {
    super();
    if (data) {
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Length(2, 4)
  @Column()
  name: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @Column({ default: false })
  isEmailConfirmed?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default User;
