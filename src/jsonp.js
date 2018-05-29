import fetchJsonp from 'fetch-jsonp';


const createParame = obj =>{
	let arr = _.entries(obj).map(([v1,v2])=>{
		return `${v1}=${v2}&`
	});
	return arr.length ? `?${arr.join('').replace(/&$/,'')}` : '';
}
//jsonpCallback
export default function jsonp(url,{params,config} = {}) {
	let {jsonpCallback='jsonpCallback',timeout=60*1000} = config;
	// log(`请求的url->${url}参数是->`,'\n',params);
	return fetchJsonp(`${url}${createParame(params)}`, {
		jsonpCallback : jsonpCallback,
		timeout,
	}).then(response=> {
		return response.json();
	}).then(json=>{
		log(`url->${url}返回值是->`,'\n',json);
		return json;
	}).catch(res=>{
		return res;
	})
}