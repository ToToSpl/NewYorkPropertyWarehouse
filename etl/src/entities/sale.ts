import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Date } from "./date";
import { Property } from "./property";
import { Location } from "./location";

@ObjectType()
@Entity()
export class Sale extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Date, { nullable: true })
  @OneToOne(() => Date)
  @JoinColumn()
  date: Date;

  @Field(() => Property, { nullable: true })
  @OneToOne(() => Property)
  @JoinColumn()
  property: Property;

  @Field(() => Location, { nullable: true })
  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;
}
