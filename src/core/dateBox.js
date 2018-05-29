let dateBox = {};
dateBox._init = function ({open,select,cancel,time}) {
    dateBox.open = open;
    dateBox.select = select;
    dateBox.cancel = cancel;
    dateBox.time=time
}
export default dateBox;