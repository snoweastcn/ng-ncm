import { getRandomInt } from './number';
import { getCurrentSong } from '../store/selectors/player.selector';
import { Song } from '../services/data-types/common.types';

export function inArray(arr: any[], target: any): boolean {
  return arr.indexOf(target) !== -1;
}


export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();

  for (let i = 0; i < result.length; i++) {
    // 0 和 i 之间的随机数
    const j = getRandomInt([0, i]);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}


export function findIndex(list: Song[], currentSong: Song): number {
  return list.findIndex(item => item.id === currentSong.id);
}
