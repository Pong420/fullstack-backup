import { RootState } from '../reducers';
import qs from 'qs';

interface Params {
  pageNo?: string;
  search?: string;
}

function parsePageNo(payload: any) {
  const pageNo = Number(payload);
  return isNaN(pageNo) ? 1 : pageNo;
}

export const searchParamSelector = (state: RootState) => {
  const { pageNo, search } = qs.parse(
    state.router.location.search.slice(1)
  ) as Params;

  return {
    pageNo: parsePageNo(pageNo),
    search
  } as const;
};
