
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

export const userProviders = [
  {
    provide: 'USER',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
