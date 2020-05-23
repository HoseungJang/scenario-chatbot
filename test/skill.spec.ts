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

        expect(result).to.have.all.keys("id", "name");

        const { id } = result;
        const block = await entityManager.findOne(Block, id);

        await entityManager.remove(block);
    });
});