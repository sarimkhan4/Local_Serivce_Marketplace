import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Provider } from './provider.entity';

/**
 * Schedule Entity
 * Represents specific availability time slots for a Provider.
 */
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'schedule_id' })
  scheduleId: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ name: 'time_slot', length: 100 })
  timeSlot: string;

  // A schedule block belongs to one provider
  @ManyToOne(() => Provider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
