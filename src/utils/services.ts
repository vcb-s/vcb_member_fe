import { useAsyncFn } from "react-use";

import { webpDetect } from "@/utils/webpDetect";
import { UserCard } from "@/utils/types/UserCard";
import { Group } from "@/utils/types/Group";
import { request, strictCheck } from "./request";

export type LoadFail = Error | undefined | unknown;
export type Loading = boolean;

const groupAdapeter = (group: Group.ItemInResponse): Group.Item => {
  return {
    ...group,
    key: `${group.id}`,
  };
};

/** 组别 */
export const useGroup = function (): [Group.Item[], LoadFail, Loading] {
  const [{ value, loading, error }, fetch] = useAsyncFn(async () => {
    return await request.group.read();
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const groups = useMemo((): Group.Item[] => {
    if (error || !value) {
      return [];
    }

    try {
      strictCheck(value);
    } catch (e) {
      return [];
    }

    return [
      ...(value?.data.data.res.map(groupAdapeter) || []),
      { key: "-1", id: -1, name: "一家人就要齐齐整整" },
    ];
  }, [value, error]);

  return [groups, new Error(error?.message || ""), loading];
};

let isSupportWebp = false;
(async () => {
  isSupportWebp = await webpDetect;
})();

const cardAvastAdaper = (avast: string): string => {
  if (avast.indexOf("//") === -1) {
    // 限定只优化 jpg/png 格式，其他格式如gif什么的就原图展现
    if (/[\.(jpg)|(png)]$/.test(avast) && isSupportWebp) {
      avast = `${avast.replace(/(.+)\..+?$/, "$1")}@600.webp`;
    } else if (!/[\.(gif)]$/.test(avast)) {
      avast = `${avast.replace(/^(.+)(\..+?)$/, "$1@600$2")}`;
    }

    avast = `https://vcb-s.com/vcbs_member/uploads/${avast}`;
  }

  return avast;
};

const cardAdaper = (card: UserCard.ItemInResponse | UserCard.Item): UserCard.Item => {
  return {
    ...card,
    key: card.id,
    avast: cardAvastAdaper(card.avast),
  };
};

/** 用户卡片 */
export const useCards = function ({
  group,
  IDS,
}: {
  group?: request.userCard.ReadParam["group"] | undefined;
  IDS?: NonNullable<request.userCard.ReadParam["IDS"]>;
}): [UserCard.Item[], LoadFail, Loading] {
  const [{ value: userCards, error: userCardsError, loading }, fetch] = useAsyncFn(async () => {
    return await request.userCard.read({ group, IDS });
  }, [group, IDS]);

  useEffect(() => {
    if (group) {
      fetch();
    }
  }, [fetch, group]);

  /** 校验错误 */
  const error = useMemo((): LoadFail => {
    if (loading || !userCards) {
      return;
    }
    if (userCardsError) {
      return userCardsError;
    }

    try {
      strictCheck(userCards);
    } catch (e) {
      return e;
    }
  }, [loading, userCards, userCardsError]);

  // 产生最后的用户数组
  const result = useMemo((): UserCard.Item[] => {
    /** 数据错误标志未清空 或正在loading 时不刷新数据 */
    if (error || loading || !userCards) {
      return [];
    }
    return userCards.data.data.res.map((item): UserCard.Item => {
      return cardAdaper(item);
    });
  }, [error, loading, userCards]);

  return [result, error, loading];
};
