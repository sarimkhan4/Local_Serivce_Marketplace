import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  TableInheritance
} from 'typeorm';

/**
 * Base User Entity
 * Uses Single Table Inheritance (STI) to manage Customer and Provider sub-entities.
 * The 'role' column acts as the discriminator.
 */
@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ select: false }) 
  password: string;

  @Column({ type: 'varchar', name: 'role', nullable: true })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}