import { request } from "@/utils/request";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { Group } from "@/utils/types/Group";

interface GroupSate {
  res: Group.Item[];
  total: number;
}

interface State {
  group: GroupSate;
  fetch(): Promise<void>;
}

function groupAdapeter(group: Group.ItemInResponse): Group.Item {
  return {
    ...group,
    key: `${group.id}`,
  };
}

export const useGroupStore = create<State>()(
  immer((set) => ({
    group: {
      res: [],
      total: 0,
    },
    async fetch() {
      const {
        data: {
          data: { res, total },
        },
      } = await request.group.read();

      const list = res.map(groupAdapeter);

      list.push({ key: "-1", id: -1, name: "一家人就要齐齐整整" });

      set((s) => {
        s.group.res = list;
        s.group.total = total;
      });
    },
  }))
);
