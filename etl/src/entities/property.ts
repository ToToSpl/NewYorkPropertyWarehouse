import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Property extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  taxClass: string;

  @Field(() => Int)
  @Column({ type: "int" })
  landSquareFeet: number;

  @Field(() => Int)
  @Column({ type: "int" })
  yearBuild: number;
}
