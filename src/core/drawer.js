let drawer = {};

/*
*   drawer.push()
*  @params : {
 *      box : xxxx,//哪一个盒子
 *  }
* **/

drawer._init = function ({pop,push,clean,check}) {
    drawer.pop = pop;
    drawer.push = push;
    drawer.clean = clean;
    drawer.check=check   //验证每个输入页面是否输入
    
}




export default drawer;