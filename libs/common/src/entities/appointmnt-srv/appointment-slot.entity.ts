import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';

@Entity({ name: 'APPOINTMENT_SLOT' })
export class APPOINTMENT_SRV_Appointment_Slot {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    providerId: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ default: true })
    isAvailable: boolean;

}
