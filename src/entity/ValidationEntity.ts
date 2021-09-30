import { validate } from "class-validator";
import { BaseEntity } from "typeorm";

abstract class ValidationEntity extends BaseEntity {
  async validate() {
    return await validate(this);
  }
}

export default ValidationEntity;
