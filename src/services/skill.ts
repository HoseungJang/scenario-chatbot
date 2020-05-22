import { Service, Inject } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { IBlock, IBlockDTO } from "../interfaces/IBlock";

@Service()
export class SkillService {
    constructor(
        @InjectManager() private entityManager: Entities.manager,
        @Inject("skillEntity") private skillEntity: Entities.skillEntity,
        @Inject("blockEntity") private blockEntity: Entities.blockEntity
    ) { }

    public async createBlock({ name, skillId }: IBlockDTO): Promise<IBlock> {
        const skill = await this.entityManager.findOne(this.skillEntity, skillId);
        const block = new this.blockEntity();

        block.name = name;
        block.skill = skill;
        await this.entityManager.save(block);

        const { id } = block;

        return { id, name };
    }
}