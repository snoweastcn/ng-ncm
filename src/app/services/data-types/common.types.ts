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
  alias: string[];
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
  coverImgUrl: string;
  tracks: Song[];
  tags: string[];
  createTime: number;
  creator: { nikname: string; avatarUrl: string };
  description: string;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  subscribed: boolean;
}
// 歌词
export interface Lyric {
  lyric: string;
  tlyric: string;
}
// 歌单列表
export interface SheetList {
  playlists: SongSheet[];
  total: number;
}
// 歌手详情
export interface SingerDetail {
  artist: Singer;
  hotSongs: Song[];
}
// 搜索结果
export interface SearchResult {
  artists?: Singer[];
  playlists?: SongSheet[];
  songs?: Song[];
}

