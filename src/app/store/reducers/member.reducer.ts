import { PlayMode } from 'src/app/share/nc-ui/nc-player/player-type';
import { Song } from 'src/app/services/data-types/common.types';
import { createReducer, on, Action } from '@ngrx/store';
import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex, SetCurrentAction } from '../actions/player.action';
import { SetModalVisible, SetModalType } from '../actions/member.action';

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
}

export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
};

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state, modalType })),
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}
