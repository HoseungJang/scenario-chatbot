import { expect } from "chai";
import { Container } from "typedi";
import { useContainer, createConnection, getManager, getConnection } from "typeorm";
import { IBlock, IBlockDTO } from "../src/interfaces/IBlock";
import { SkillService } from "../src/services/skill";
import { Skill } from "../src/entities/skill";
import { Block } from "../src/entities/block";
import * as dotenv from "dotenv";
dotenv.config({ path: "test.env" });

describe("SkillService", async () => {
    before(async () => {
        useContainer(Container);
        await createConnection();
        Container.set("skillEntity", Skill);
        Container.set("blockEntity", Block);
    });

    after(() => {
        getConnection().close();
    });

    it("createBlock", async () => {
        const entityManager = getManager();
        const skillServiceInstance = Container.get(SkillService);
        const blockDTO: IBlockDTO = {
            name: "테스트",
            skillId: -1
        };
        const result: IBlock = await skillServiceInstance.createBlock(blockDTO);

        expect(result.name).to.equal(blockDTO.name);

        const { id } = result;
        const block = await entityManager.findOne(Block, id);

        await entityManager.remove(block);
    });

    it("getStartBlockId", async () => {
        const entityManager = getManager();
        const skillServiceInstance = Container.get(SkillService);
        const skill = new Skill();
        const block = new Block();

        skill.name = "테스트스킬";
        await entityManager.save(skill);

        block.name = "시작";
        block.skill = skill;
        await entityManager.save(block);

        const result: { id: number } = await skillServiceInstance.getStartBlockId(skill.id);

        expect(result.id).to.equal(block.id);

        await entityManager.remove(skill);
        await entityManager.remove(block);
    });
});