import { Service, Inject } from "typedi";
import { getManager } from "typeorm";
import { IBlock, IBlockDTO } from "../interfaces/IBlock";

@Service()
export class SkillService {
    constructor(
        @Inject("skillEntity") private skillEntity: Entities.skillEntity,
        @Inject("blockEntity") private blockEntity: Entities.blockEntity
    ) { }

    public async createBlock({ name, skillId }: IBlockDTO): Promise<IBlock> {
        const entityManager = getManager();
        const skill = await entityManager.findOne(this.skillEntity, skillId);
        const block = new this.blockEntity();

        block.name = name;
        block.skill = skill;
        await entityManager.save(block);

        const { id } = block;

        return { id, name };
    }
}