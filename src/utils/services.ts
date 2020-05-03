import { useMemo, useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { produce } from 'immer';

import { webpDetect } from '@/utils/webpDetect';
import { UserCard } from '@/utils/types/UserCard';
import { Group } from '@/utils/types/Group';
import { request, ajax, strictCheck } from './request';

export type LoadFail = Error | undefined;
export type Loading = boolean;

const groupAdapeter = (group: Group.ItemInResponse): Group.Item => {
  return {
    ...group,
    key: group.id,
  };
};

/** 组别 */
export const useGroup = function (): [Group.Item[], LoadFail, Loading] {
  const { data, error, isValidating } = useSWR(
    request.group.url,
    request.group.read,
  );

  const groups = useMemo((): Group.Item[] => {
    if (error || !data) {
      return [];
    }

    try {
      strictCheck(data);
    } catch (e) {
      return [];
    }

    return [
      ...(data?.data.data.res.map(groupAdapeter) || []),
      { key: '-1', id: '-1', name: '一家人就要齐齐整整' },
    ];
  }, [data, error]);

  return [groups, new Error(error), isValidating];
};

interface UserCardInMap {
  [groupID: string]: UserCard.Item[];
}

let isSupportWebp = false;
(async () => {
  isSupportWebp = await webpDetect;
})();

const cardAvastAdaper = (avast: string): string => {
  if (avast.indexOf('//') === -1) {
    // 限定只优化 jpg/png 格式，其他格式如gif什么的就原图展现
    if (/[\.(jpg)|(png)]$/.test(avast) && isSupportWebp) {
      avast = `${avast.replace(/(.+)\..+?$/, '$1')}@600.webp`;
    } else if (!/[\.(gif)]$/.test(avast)) {
      avast = `${avast.replace(/^(.+)(\..+?)$/, '$1@600$2')}`;
    }

    avast = `https://cache.cswsadlab.com/vcbs_member/uploads/${avast}`;
  }

  return avast;
};

const cardAdaper = (
  card: UserCard.ItemInResponse | UserCard.Item,
): UserCard.Item => {
  return {
    ...card,
    key: card.id,
    avast: cardAvastAdaper(card.avast),
  };
};

/** 用户卡片 */
export const useCards = function (
  group: request.userCard.ReadParam['group'],
): [UserCard.Item[], LoadFail, Loading] {
  /**　这里故意不使用依赖刷新 */
  const { data: userCards, error: userCardsError, isValidating } = useSWR(
    group ? [request.userCard.url, group] : null,
    (url, group) => request.userCard.read({ group }),
  );
  /** 校验错误 */
  const error = useMemo((): LoadFail => {
    if (isValidating || !userCards) {
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
  }, [isValidating, userCards, userCardsError]);

  // 产生最后的用户数组
  const result = useMemo((): UserCard.Item[] => {
    /** 数据错误标志未清空 或正在loading 时不刷新数据 */
    if (error || isValidating || !userCards) {
      return [];
    }
    return userCards.data.data.res.map(
      (item): UserCard.Item => {
        return cardAdaper(item);
      },
    );
  }, [error, isValidating, userCards]);

  return [result, error, isValidating];
};
