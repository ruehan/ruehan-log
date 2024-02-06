import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

export function generateToken() {
  const token = uuidv4();
  return token;
}


export const fetcher = (url: any) => fetch(url).then((res) => res.json());

export function unix_timestamp(t: moment.MomentInput){  
    return moment(t).format('YYYY-MM-DD HH:mm:ss')
  }

export function isUpdated(t: moment.MomentInput){
  const inputTime = moment(t);
  const updatedTime = moment().subtract(7, 'days');

  return inputTime.isAfter(updatedTime)
}