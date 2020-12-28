import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { settings } from 'cluster';

@Entity({name: 'settings'})
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({unique: true})
    @Column('int', {name: 'user_id'})
    userId: number;
}