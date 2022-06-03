import { request } from "@/utils/request";
import { UserCard } from "@/utils/types/UserCard";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { webpDetect } from "@/utils/webpDetect";

/** @private */
async function cardAvastAdaper(avast: string): Promise<string> {
  if (avast.indexOf("//") === -1) {
    // 限定只优化 jpg/png 格式，其他格式如gif什么的就原图展现
    if (/[\.(jpg)|(png)]$/.test(avast) && (await webpDetect)) {
      avast = `${avast.replace(/(.+)\..+?$/, "$1")}@600.webp`;
    } else if (!/[\.(gif)]$/.test(avast)) {
      avast = `${avast.replace(/^(.+)(\..+?)$/, "$1@600$2")}`;
    }

    avast = `https://vcb-s.com/vcbs_member/uploads/${avast}`;
  }

  return avast;
}

/** @private */
async function cardAdaper(card: UserCard.ItemInResponse | UserCard.Item): Promise<UserCard.Item> {
  return {
    ...card,
    key: card.id,
    avast: await cardAvastAdaper(card.avast),
  };
}

type GroupId = number;

type Cards = {
  res: UserCard.Item[];
  total: number;
};

interface State {
  cards: {
    [key: GroupId]: Cards;
  };
  fetch(group: GroupId): Promise<void>;
}

export const useCardStore = create<State>()(
  immer((set) => ({
    cards: {},
    async fetch(group: GroupId) {
      const {
        data: {
          data: { res, total },
        },
      } = await request.userCard.read({ group });

      const list = await Promise.all(res.map(cardAdaper));

      set((s) => {
        s.cards[group] = {
          res: list,
          total: total,
        };
      });
    },
  }))
);
