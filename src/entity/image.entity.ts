import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'image'})
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'width' })
  width: number;

  @Column('int', { name: 'height' })
  height: number;

  @Column('varchar', { name: 'url', length: 200 })
  url: string;

  @Column('varchar', { name: 'mime', length: 50 })
  mime: string;

  @Column('int', { name: 'size' })
  size: number; // 单位字节

  @Column('varchar', { name: 'format', length: 50 })
  format: string;
}