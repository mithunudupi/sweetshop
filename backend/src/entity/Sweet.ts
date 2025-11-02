import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Sweet {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column("float")
  price!: number;

  @Column("integer")
  quantity!: number;
}
