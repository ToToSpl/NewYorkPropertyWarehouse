import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Date extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column({ type: "int" })
  day: number;

  @Field(() => Int)
  @Column({ type: "int" })
  month: number;

  @Field(() => Int)
  @Column({ type: "int" })
  year: number;
}
