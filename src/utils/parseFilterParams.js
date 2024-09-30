const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseIsFavourite = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  if (!['true', 'false'].includes(value)) return;
  return value === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;
  const parsedType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
