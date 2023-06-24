import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);

    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findProductByIdOrFail(id);

    return this.productRepository.save({
      ...product,
      ...updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.findProductByIdOrFail(id);

    await this.productRepository.remove(product);

    return {
      success: true,
    };
  }

  async findProductByIdOrFail(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async checkIfProductExists(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (product) {
      throw new HttpException('Product already exists', HttpStatus.CONFLICT);
    }
  }
}
