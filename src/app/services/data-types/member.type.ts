export interface User {
  // 用户等级
  level?: number;

  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
}


export interface Signin {
  code: number;
  point?: number;
  msg?: string;
}
