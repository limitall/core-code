import { Entity, Column, PrimaryColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsAlphanumeric, Length, IsIn } from 'class-validator';
import { PatientStatus } from './patient-status.enum';


@Entity('patient')
export class PATIENT_SRV_patient {
    @PrimaryColumn('varchar')
    @IsAlphanumeric()
    @Length(8, 8)
    id: string; // maps PatientId.value

    @Column('varchar')
    @Length(1, 50)
    name: string; // maps PatientName.value

    @Column({ type: 'varchar', length: 255 })
    @IsEmail()
    @Index({ unique: true })
    email: string; // maps Email.value

    @Column({ type: 'smallint' })
    @IsIn([0, 1]) // 0: INACTIVE, 1: ACTIVE
    status: PatientStatus; // maps PatientStatus.value

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 8 })
    @IsAlphanumeric()
    @Length(8, 8)
    @Index()
    locId: string; // assumed FK, normalized

    @Column({ type: 'varchar', length: 8 })
    @IsAlphanumeric()
    @Length(8, 8)
    @Index()
    orgId: string; // assumed FK, normalized

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;
}
