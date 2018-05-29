
import {combineReducers} from 'redux';

import * as order from './order';
import * as census from './census';
import * as spgl from './spgl';


export default combineReducers({
	...order,
	...census,
	...spgl
})
