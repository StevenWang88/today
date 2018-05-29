//验证输入框输入的值 

let uleCheck = {
    upc(value) {
        //限制upc最多13位整数 
        value = value.replace(/\D/g, '').substring(0, 13)
        return value
    },
    itemName(value) {
        //限制商品名称 和 分类名称 商品规格最多20位 
        value = value.substring(0, 20)
        return value
    },
    price(value) {
        //进货价格 销售价格 进货数量 
        value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        value = value.replace(/^\.$/, "");     //如果以.开头或结尾就替换
        value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (value != "") {
            let index = value.indexOf('.');
            if (index > 0) {
                let n=0
                if(index>=4){
                    n=4
                }else{
                    n=index
                }
                let a = value.substring(0, n)
                let b = value.substring(index)
                value=a+b
            }else{
                value = value.replace(/\D/g, '').substring(0, 4)
                value = parseFloat(value);

            }
        }
        return value
    },
    quantityCheck(value){
        //商品数量，限制输入整数
        value=String(value)
        value = value.replace(/\D/g, '').substring(0)
        if (value != "") {
            value = parseInt(value);
        }
        return value
    },
    qualityPeriod(value) {
        //保质期
        value = value.replace(/\D/g, '').substring(0, 4)
        if (value != "") {
            value = parseFloat(value);
        }
        return value
    },
    orderId(randId) {
        let test = /^([1-9][0-9]{0,24})$/.test(randId)
        if (!randId) {
            return true
        }
        return test
    },
}
export default uleCheck;