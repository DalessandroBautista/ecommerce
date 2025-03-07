// src/productos/productos.module.ts
import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './producto.controller';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
