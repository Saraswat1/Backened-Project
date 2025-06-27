import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
imports: [
// Load environment variables globally
ConfigModule.forRoot({ isGlobal: true }),
// Connect to SQLite and auto-load all entity files (including Doctor and Patient)
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
})


// Custom application modules
AuthModule,
UsersModule,
],
})
export class AppModule {}
