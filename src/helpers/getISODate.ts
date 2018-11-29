import * as format from 'date-fns/format';
import { FORMAT_FULL_DAY } from '../constants';

export default function getISODate(date: Date, dayDiffecrence: number): string {
  const selectedDate = new Date();
  const ms = selectedDate.setDate(date.getDate() + dayDiffecrence);
  const ISODate = new Date(ms).toISOString();
  return format(ISODate, FORMAT_FULL_DAY);
}
