import { Match, Concert } from "./model";
import { AppDataSource } from "./index";

export const resolvers = {
  Query: {
    matches: async () => {
      const matchRepository = AppDataSource.getRepository(Match);
      return await matchRepository.find();
    },
    match: async (_, { id }) => {
      const matchRepository = AppDataSource.getRepository(Match);
      return await matchRepository.findOneBy({ id: parseInt(id) });
    },
    concerts: async () => {
      const concertRepository = AppDataSource.getRepository(Concert);
      return await concertRepository.find();
    },
    concert: async (_, { id }) => {
      const concertRepository = AppDataSource.getRepository(Concert);
      return await concertRepository.findOneBy({ id: parseInt(id) });
    },
  },
};
