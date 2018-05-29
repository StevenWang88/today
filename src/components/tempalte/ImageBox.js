const defaultImg = require('@/assets/no_good.png');
import { Modal, Button } from 'antd';
export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    }
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }
  openPhoto() {
    this.setModalVisible(false)
    this.props.openPhoto()
  }
  takePhoto() {
    this.setModalVisible(false)
    this.props.takePhoto()
  }
  handleImageErrored(item) {
		this.refs.itemImg1.src=defaultImg
    }
  render() {
    let { imageUrl, disabled, openPhoto,takePhoto } = this.props;
    return (
      <div>
        <div className="img_box" onTouchTap={() => this.setModalVisible(true)}>
          <div className="imgBox animated fadeIn">
            <img 
            onError={this.handleImageErrored.bind(this)}
            ref="itemImg1" src={imageUrl ? imageUrl : defaultImg} alt="" />
          </div>
        </div>
        <div className="modal_box">
          <Modal
            wrapClassName="vertical-center-modal ule-good-img"
            visible={disabled ? false : this.state.modalVisible}
            onCancel={() => this.setModalVisible(false)}
            ancelText={false}
            footer={null}
            closable={false}
          >
            <p style={{ 'color': '#999' }}>修改图片</p>
            {/* <p onTouchTap={this.openPhoto.bind(this)}>相 册</p> */}
            {/* <p onTouchTap={this.takePhoto.bind(this)}>拍 照</p> */}
            <p onTouchTap={()=>{openPhoto && this.openPhoto()}}>相 册</p>
            <p onTouchTap={()=>{takePhoto && this.takePhoto()}}>拍 照</p>
          </Modal>
        </div>
      </div>
    );
  }
}
ImageBox.propTypes = {
  openPhoto: PropTypes.func,
  takePhoto: PropTypes.func
}