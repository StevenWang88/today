import Lazyload from './Lazyload.js';
import React from 'react';
export default (component) =>(locals) => {
	return (
		<Lazyload load={component}>
			{
				(Component) => Component?<Component {...locals}/>:false
			}
		</Lazyload>
	)
}