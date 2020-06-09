import React from "react"
import PropTypes from "prop-types"
class FileUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      src: this.props.src
    }

    this.handleImageChange = this.handleImageChange.bind(this);
  }

  handleImageChange = e => {
    alert(URL.createObjectURL(e.target.files[0]));
    if (e.target.files[0]) this.setState({src: URL.createObjectURL(e.target.files[0])});
  };

  render () {
    return (
      <React.Fragment>
        <div className='user-avatar'>
          <img src={this.state.src} />
          <input type="file" name={this.props.sourceInputName} accept="image/png, image/jpeg" id="user_user_profile_attributes_avatar" onChange={this.handleImageChange}/>
        </div>
      </React.Fragment>
    );
  }
}

FileUploader.propTypes = {
  src: PropTypes.string,
  sourceInputName: PropTypes.string,
  fileTypes: PropTypes.string
};
export default FileUploader
