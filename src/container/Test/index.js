import {Route} from 'react-router-dom';
import aaa from './AAA';
export default class NameForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event) {
		this.setState({value: 222222});
	}
	
	componentWillMount() {
		function imgLoad(url) {
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('GET', url);
				request.responseType = 'blob';
				request.onload = function() {
					if (request.status === 200) {
						resolve(request.response);
					} else {
						reject(Error('Image didn\'t load successfully; error code:'
							+ request.statusText));
					}
				};
				request.onerror = function() {
					reject(Error('There was a network error.'));
				};
				request.send();
			});
		}
		
		imgLoad('http://localhost:4545/i/small.png').then(res=>{
			log(res)
		})
	}
	render() {
		return (
			<div>
				<input type="text" value={this.state.value} onChange={this.handleChange} />
				<Route exact path={`${this.props.match.url}/cc`} render={()=>(<div>出来了啊</div>)}/>
			</div>
		);
	}
}