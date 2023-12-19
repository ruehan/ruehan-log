import moment from "moment";

export const fetcher = (url: any) => fetch(url).then((res) => res.json());

export function unix_timestamp(t: moment.MomentInput){  
    return moment(t).format('YYYY-MM-DD HH:mm:ss')
  }