/*

isBeta 为 true打包 beta ，false打包生产

*/ 


const isBeta =true;   
//  DOMAIN: isBeta ? '//vps.beta.ule.com' : '//vps.ule.com',
const app = {
  DOMAIN: isBeta ? '//vps.beta.ule.com' : '//vps.ule.com',
  isBeta:isBeta
}
export default app