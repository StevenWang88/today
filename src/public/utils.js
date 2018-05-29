//高精度加法
export const accAdd = (arg1, arg2) => {
    let r1, r2, m, num = 0;
    let p1 = Number(arg1).toString(), p2 = Number(arg2).toString();
    try{
        r1 = p1.split('.')[1].length
    }catch(e){
        r1 = 0
    }
    try{
        r2 = p2.split('.')[1].length
    }catch(e){
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1,r2))
    num = accMul(arg1,m) + accMul(arg2, m);
    return num/m
}
//高精度乘法
export const accMul = (arg1, arg2) => {
    let m = 0, s1 = Number(arg1).toString(), s2 = Number(arg2).toString();
    try{
        m+=s1.split(".")[1].length
    }catch(e){}
    try{
        m+=s2.split(".")[1].length
    }catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}