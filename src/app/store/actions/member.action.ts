import { createAction, props } from '@ngrx/store';
import { ModalTypes } from '../reducers/member.reducer';

export const SetModalVisible = createAction('[player] set modal visible', props<{ modalVisible: boolean }>());
export const SetModalType = createAction('[player] set modal type', props<{ modalType: ModalTypes }>());

