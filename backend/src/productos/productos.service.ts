// src/productos/productos.service.ts
import { Injectable } from '@nestjs/common';
import { Producto } from './producto.entity';

@Injectable()
export class ProductosService {
  private productos: Producto[] = [];

  findAll(): Producto[] {
    return this.productos;
  }

  create(producto: Producto) {
    this.productos.push(producto);
  }
}
