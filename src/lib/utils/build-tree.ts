type BaseItem = {
  id: number;
  parentID: number | null;
};

type TreeItem<T extends BaseItem> = Omit<T, 'parentID'> & {
  children: TreeItem<T>[];
};

export function buildTree<T extends BaseItem>(items: T[]): TreeItem<T>[] {
  const itemMap = new Map<number, TreeItem<T>>();

  items.forEach((item) => {
    itemMap.set(item.id, {
      ...item,
      children: []
    } as TreeItem<T>);
  });

  const rootItems: TreeItem<T>[] = [];

  items.forEach((item) => {
    const treeItem = itemMap.get(item.id)!;

    if (item.parentID === null) {
      rootItems.push(treeItem);
    } else {
      const parent = itemMap.get(item.parentID);
      if (parent) {
        parent.children.push(treeItem);
      }
    }
  });

  return rootItems;
}
