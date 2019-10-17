import { PlayMode } from 'src/app/share/nc-ui/nc-player/player-type';
import { Song } from 'src/app/services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex, SetCurrentAction } from '../actions/player.action';
import { SetModalVisible, SetModalType, SetUserId } from '../actions/member.action';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export interface MemberState {
  modalVisible: boolean;
  modalType: ModalTypes;
  userId: string;
}

export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
  userId: ''
};

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state, modalType })),
  on(SetUserId, (state, { id }) => ({ ...state,  userId: id })),
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}
