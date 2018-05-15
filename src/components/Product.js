import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectProduct } from '../actions/productActions';
import {
  applyTemplate,
  addImageToFrame,
  addTextToFrame,
  nextPage,
  previousPage,
} from '../actions/pageActions';
import PageImage, { CALL_BACK_ENUMS } from './PageImage';
import RaisedButton from 'material-ui/RaisedButton';

import '../styles/Product.css';

const VIEW_CALL_BACK_ENUMS = {
  ...CALL_BACK_ENUMS,
  ADD_TEXT_TO_FRAME: 'ADD_TEXT_TO_FRAME',
};

class Product extends Component {
  callbackHandler = (type, data) => {
    switch (type) {
      case VIEW_CALL_BACK_ENUMS.ADD_TEXT_TO_FRAME:
        this.props.addTextToFrame(data.id, data.value, data.index);
        break;
      case VIEW_CALL_BACK_ENUMS.ADD_IMAGE_TO_FRAME:
        this.props.addImageToFrame(data.id, data.value, data.index);
        break;
    }
  }

  renderProductDetail() {
    return (
      <div className="product-detail">
        <div>{this.props.product.type}</div>
        <div>{this.props.product.size}</div>
        <div>{this.props.product.pageNumber} pages</div>
        <div>{this.props.product.price}</div>
        <div>{this.props.product.priceUnit}</div>
      </div>
    )
  }

  renderSpread(i) {
    if (i == null)
      return;
    return (
      <Spread
        pages={this.props.pages}
        index={i}
        addImageToPage={this.addImageToPage}
        callbackHandler={this.callbackHandler}
        isPreview = {this.props.isPreview}
      />
    )
  }


  render() {
    let buttonNavStyle = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: '#3E3E3E',
      zIndex: 3,
    };
    if (!Object.keys(this.props.product).length)
      return null;
    return (
      <div className="product-view-design">
        {this.renderProductDetail()}
        <div className="product-view-design-container-wrapper">
        <table style={{borderCollapse: 'collapse'}}>
          <tbody>
        <tr>
          <td style={{borderCollapse: 'collapse'}}>
              <RaisedButton onClick={this.props.previousPage} type="button" backgroundColor="#0288D1" labelColor="#FFFFFF" buttonStyle={{height: '70px'}} labelStyle={{fontSize: '60px'}} label="<"/>
          </td>
          <td>
          <div className="product-view-design-container">
            {this.renderSpread(this.props.current)}
          </div>
          </td>
          <td style={{borderCollapse: 'collapse'}}>
              <RaisedButton onClick={this.props.nextPage} type="button" backgroundColor="#0288D1" labelColor="#FFFFFF" buttonStyle={{height: '70px'}} labelStyle={{fontSize: '60px'}} label=">"/>
          </td>
          </tr>
          </tbody>
        </table>
        </div>
      </div>
    )
  }
}

class Spread extends Component {
  callbackHandler = (type, data) => {
    switch (type) {
      default:
        // bubble up all other actions to parents
        this.props.callbackHandler(type, data);
    }
  }

  renderPage(i) {
    if (i < 0) {
      return (
        <div className="bleed transparent"></div>
      )
    }
    else if (i >= this.props.pages.length) {
      return (
        <div className="bleed bleed-right transparent"></div>
      )
    }

    return (
      <Page
        index={i}
        value={this.props.pages[i]}
        addImageToPage={this.props.addImageToPage}
        callbackHandler={this.callbackHandler}
        isPreview = {this.props.isPreview}
      />
    )
  }

  render() {
    return (
      <div className="spread">
        {this.renderPage(this.props.index * 2 - 1)}
        {this.renderPage(this.props.index * 2)}
      </div>
    )
  }
}

class Page extends Component {
  callbackHandler = (type, data) => {
    switch (type) {
      case VIEW_CALL_BACK_ENUMS.ADD_TEXT_TO_FRAME:
        this.props.callbackHandler(type, { ...data, index: this.props.index, });
        break;
      case VIEW_CALL_BACK_ENUMS.ADD_IMAGE_TO_FRAME:
        this.props.callbackHandler(type, { ...data, index: this.props.index, });
      default:
        // bubble up all other actions to parents
        this.props.callbackHandler(type, data);
    }
  }

  renderImage(i) {
    return (
      <PageImage
        key={this.props.value.images[i].id}
        value={this.props.value.images[i]}
        callbackHandler={this.callbackHandler}
      />
    )
  }

  renderText(i) {
    return (
      <Text
        key={this.props.value.texts[i].id}
        value={this.props.value.texts[i]}
        callbackHandler={this.callbackHandler}
      />
    )
  }

  render() {
    const images = this.props.value.images.map((img, i) => {
      return (
        this.renderImage(i)
      );
    });

    const texts = this.props.value.texts.map((txt, i) => {
      return (
        this.renderText(i)
      );
    });

    const layout = {
      "gridTemplateRows": `repeat(${this.props.value.rows - 1}, 1fr 12px) 1fr`,
      "gridTemplateColumns": `repeat(${this.props.value.columns - 1}, 1fr 12px) 1fr`,
      "gridTemplateAreas": this.props.value.area,
    };
    
    let className = 'bleed';
    if (!this.props.isPreview) {
      if (!(this.props.index % 2)) {
        className += ' bleed-right';
      }
    } else {
      className = 'preview';
      if (this.props.index % 2) {
        className += ' preview-right';
      }
    }

    return (
      <div className={className}>
        <div className="page" style={layout}>
          {images}
          {texts}
        </div>
      </div>
    )
  }
}

class Text extends Component {
  inputChangeHandler = (e) => {
    this.props.callbackHandler(
      VIEW_CALL_BACK_ENUMS.ADD_TEXT_TO_FRAME,
      {
        id: this.props.value.id,
        value: e.target.innerText,
      },
    );
  }

  render() {
    const style = JSON.parse(this.props.value.style);

    return (
      <div className="textFrame"
        style={style}
        onBlur={(e) => this.inputChangeHandler(e)}
        contentEditable="true">
        {this.props.value.value}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  product: state.products.product,
  pages: state.pages.pages,
  current: state.pages.current,
  isPreview: state.preview.isPreview,
});

export default connect(mapStateToProps, { selectProduct, applyTemplate, addImageToFrame, addTextToFrame, nextPage, previousPage })(Product);
export { Page };
