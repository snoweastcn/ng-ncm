// 轮播
export interface Banner {
  targetId: number;
  url: string;
  imageUrl: string;
}
// 热门标签
export interface HotTag {
  id: number;
  name: string;
  position: number;
}
// 歌手
export interface Singer {
  id: number;
  name: string;
  albumSize: number;
  picUrl: string;
}
// 歌曲
export interface Song {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: {
    id: number;
    name: string;
    picUrl: string;
  };
  dt: number;
}
// 歌曲地址
export interface SongUrl {
  id: number;
  url: string;
}
// 歌单
export interface SongSheet {
  id: number;
  name: string;
  plauCount: number;
  picUrl: string;
  tracks: Song[];
}

