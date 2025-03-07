import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/producto.modulo';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'base_ecommerce', // Nombre del contenedor de PostgreSQL
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'base',
      password: process.env.DATABASE_PASSWORD || '1003',
      database: process.env.DATABASE_NAME || 'alfombras_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
