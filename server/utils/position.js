export const POSITION_GAP = 1000;
export const MIN_POSITION_GAP = 1;

export const newPositionBetween = (before, after) => {
  // before/after are numbers or null

  // case 1: empty list
  if (before === null && after === null) return POSITION_GAP;

  // case 2: first place in list
  if (before === null) return after - POSITION_GAP;

  // case 3: last place in list
  if (after === null) return before + POSITION_GAP;

  // case 4: between two components
  const mid = (before + after) / 2;
  // If too tight, caller should trigger a rebalance
  return mid;
};

export const isPositionGapTight = (before, after) => {
  if (before === null || after === null) return false;

  return after - before < MIN_POSITION_GAP;
};

export const rebalancePositions = async (Model, filter) => {
  const items = await Model.find(filter).sort({ position: 1, _id: 1 });

  if (items.length === 0) return [];

  await Promise.all(
    items.map((item, index) => {
      item.position = (index + 1) * POSITION_GAP;
      return item.save();
    }),
  );

  return items;
};
