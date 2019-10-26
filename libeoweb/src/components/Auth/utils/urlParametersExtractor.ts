export const extractEmailFromURL = (): string | undefined => {
  const URLParams: string[] = top.location.search.replace(/\?/, '').split('&');

  const emailParam = URLParams.find(param => {
    return param.startsWith('email');
  });
  if (!emailParam) {
    return undefined;
  }
  return emailParam.split('=').pop();
};
