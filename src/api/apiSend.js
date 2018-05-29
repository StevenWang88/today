import apiList from './http';
import jsonp from '../jsonp';
import APP from "./apiConfig"

let apiMap = {};
const domin = APP.DOMAIN
apiList.forEach(({url,name})=>{
	let api = apiMap[name];
	if(!api){
		apiMap[name] = {
			send(params = {},config = {}){
				params.usrOnlyId = local.get("usrOnlyId") ||10000024742
				params.villageNo= local.get("villageNo")||'ceshi888'
				return jsonp(domin + url,{
					params,
					config
				})
			}
		}
	}else{
		throw Error(name,'接口重名')
	}
})

// 10000024742
// ceshi888

// 10000025655
// jiangxi01

// 10000025663
// ceshi777

// ceshi237
// 10000029273



export default apiMap;
