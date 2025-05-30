import { SetMetadata } from '@nestjs/common';

export const Db = (...args: string[]) => {
    console.log("************ From DB Decorator*********");

    return SetMetadata('db', args)
};
