import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgreService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {
        console.log("data:::::::", this.dataSource.manager.getRepository('Patient'));
    }
}
