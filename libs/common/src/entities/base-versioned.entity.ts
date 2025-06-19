// src/common/entities/base-versioned.entity.ts
import { Column, BeforeInsert } from 'typeorm';

export abstract class BaseVersionedEntity {
    @Column({
        name: 'version',                    // Column name is 'version'
        type: 'bigint',
        default: 1,
        nullable: false,
        select: true, // Force selection
        insert: true, // Ensure it's included in INSERT
        update: false, // Don't update via TypeORM (let trigger handle it)
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseInt(value, 10) // Convert string to number
        },
        comment: 'Tupal automatic version counter'
    })
    version: number;

    @BeforeInsert()
    setInitialVersion(): void {
        if (!this.version || this.version < 1) {
            this.version = 1;
        }
    }

    /**
     * Check if this entity has been modified (version > 1)
     */
    hasBeenModified(): boolean {
        const versionNum = typeof this.version === 'string'
            ? parseInt(this.version, 10)
            : this.version;
        return versionNum > 1;
    }

    /**
     * Get the number of times this entity has been updated
     */
    getUpdateCount(): number {
        const versionNum = typeof this.version === 'string'
            ? parseInt(this.version, 10)
            : this.version;
        return Math.max(0, versionNum);
    }

    /**
     * Get version information as a string
     */
    getVersionInfo(): string {
        const updates = this.getUpdateCount();
        if (updates === 0) {
            return 'Original version';
        }
        return `Version ${this.version} (${updates} update${updates === 1 ? '' : 's'})`;
    }
}