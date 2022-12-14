import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Cascader } from 'antd';
import { connect } from 'react-redux';
import constants from '../../../../constants/variable.js'
import { handleApiPath, nameLengthLimit } from '../../../../common.js'
const HTTP_METHOD = constants.HTTP_METHOD;
const HTTP_METHOD_KEYS = Object.keys(HTTP_METHOD);

const FormItem = Form.Item;
const Option = Select.Option;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@connect(
  state => {
    return {
      mulMenuData: state.inter.mulMenuData
    };
  },

)
class AddInterfaceForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    catid: PropTypes.number,
    catdata: PropTypes.array,
    mulMenuData: PropTypes.object
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let postData = values;
      postData.catid = values.catids[values.catids.length - 1];
      if (!err) {
        this.props.onSubmit(postData, () => {
          this.props.form.resetFields();
        });

      }
    });
  }
  handlePath = (e) => {
    let val = e.target.value
    this.props.form.setFieldsValue({
      path: handleApiPath(val)
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET'
    })(
      <Select style={{ width: 75 }}>
        {HTTP_METHOD_KEYS.map(item => {
          return <Option key={item} value={item}>{item}</Option>
        })}
      </Select>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (

      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="????????????"
        >
          {getFieldDecorator('catids', {
            initialValue: this.props.mulMenuData[this.props.catid]
          })(
            <Cascader
              options={this.props.catdata}
              changeOnSelect
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="????????????"
        >
          {getFieldDecorator('title', {
            rules: nameLengthLimit('??????')
          })(
            <Input placeholder="????????????" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="????????????"
        >
          {getFieldDecorator('path', {
            rules: [{
              required: true, message: '?????????????????????!'
            }]
          })(
            <Input onBlur={this.handlePath} addonBefore={prefixSelector} placeholder="/path" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="???"
        >
          <span style={{ color: "#929292" }}>???????????????????????????????????????????????????</span>
        </FormItem>
        <FormItem className="catModalfoot" wrapperCol={{ span: 24, offset: 8 }} >
          <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }}  >??????</Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            ??????
          </Button>
        </FormItem>

      </Form>

    );
  }
}

export default Form.create()(AddInterfaceForm);
