import {User} from './user';
import {Action} from './action';

export interface Message {
    message_id: number;
    from?: User;
    content?: any;
    action?: Action;
}
