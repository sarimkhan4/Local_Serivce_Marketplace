import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

/**
 * Address Entity
 * Represents physical locations associated with users and where bookings occur.
 */
@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn({ name: 'address_id' })
  addressId: number;

  @Column({ length: 255 })
  street: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ name: 'zip_code', length: 20 })
  zipCode: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  // An address belongs to a single user (M:1 relationship)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
