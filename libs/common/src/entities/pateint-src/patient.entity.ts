import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('patient')
export class Patient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ length: 100 })
    firstName: string;

    @Index()
    @Column({ length: 100 })
    lastName?: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth?: Date;

    @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: true })
    gender?: 'MALE' | 'FEMALE' | 'OTHER';

    @Column({ length: 15, nullable: true })
    phoneNumber?: string;

    @Column({ length: 100, nullable: true })
    email?: string;

    @Column({ length: 250, nullable: true })
    address?: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
