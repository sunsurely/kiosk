import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as NodeCache from 'node-cache';
import { OptionEntity } from 'src/entities/option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsOptionsService {
  constructor(
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
  ) {}
  cache = new NodeCache();

  initCachedOptions = async () => {
    try {
      const options: OptionEntity[] = await this.optionRepository.find();

      for (const option of options) {
        this.cache.set(`cacheKey${option.option_id}`, option);
      }

      console.log('options 데이터 캐싱 성공');
    } catch (err) {
      console.error('options 데이터 캐싱 실패', err);
    }
  };

  getCachedOption = (option_id) => {
    try {
      const cachedOption: OptionEntity = this.cache.get(`cacheKey${option_id}`);
      if (!cachedOption) {
        throw new NotFoundException('캐시된 데이터 불러오기 실패');
      }

      return cachedOption;
    } catch (err) {
      console.error('options 데이터 GET 실패', err);
    }
  };
}
