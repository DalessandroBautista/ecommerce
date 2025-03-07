// src/productos/productos.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll(): Producto[] {
    return this.productosService.findAll();
  }

  @Post()
  create(@Body() producto: Producto) {
    this.productosService.create(producto);
  }
}
