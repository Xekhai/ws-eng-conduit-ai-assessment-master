import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './tag.entity';
import { ITagsRO } from './tag.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async find(tagName: string): Promise<Tag | null> {
    return await this.tagRepository.findOne({ tag: tagName });
  }

  async create(tagName: string): Promise<Tag> {
    const tag = new Tag();
    tag.tag = tagName;
    await this.tagRepository.persistAndFlush(tag);
    return tag;
  }
  
  async findAll(): Promise<ITagsRO> {
    const tags = await this.tagRepository.findAll();
    return { tags: tags.map((tag) => tag.tag) };
  }
}
