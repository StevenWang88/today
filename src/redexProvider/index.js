import {Provider} from 'react-redux';
import Route from '../router';
import {createStore,applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import reducers from '../reducer';
import thunk from 'redux-thunk';
import Drawers from 'temp/Drawers';

const logger = createLogger();
const middleware = [thunk];
if (process.env.NODE_ENV === `development`) {
	middleware.push(logger);
}


const store = createStore(reducers,applyMiddleware(...middleware))
info('初始化store成功state=>>',store.getState())
export default class Container extends React.Component{
	render(){
		return(
			<Provider store={store}>
				<div>
					 <Drawers/> 
					<Route/>
				</div>
			</Provider>
		)
	}
}