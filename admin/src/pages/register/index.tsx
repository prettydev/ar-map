import React from "react";
import { Form, Icon, Input, Button } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";
import { RouterProps } from "react-router";
import "./login.scss";
import { register } from "../../utils/api";
function LoginForm(props: FormComponentProps & RouterProps) {
  const { form, history } = props;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        const { email, password, confirm } = values;

        if (password !== confirm) {
          alert("Inut the same password!");
          return;
        }

        const { data, headers } = await register({ email, password });

        if (data.success) {
          history.push("/");
        } else {
          alert(data.msg);
        }
      }
    });
  };
  const iconColor = { color: "rgba(0,0,0,.25)" };
  return (
    <div id="login">
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {form.getFieldDecorator("email", {
            rules: [{ required: true, message: "Input the email!!" }],
          })(
            <Input
              prefix={<Icon type="mail" style={iconColor} />}
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator("password", {
            rules: [{ required: true, message: "Input the password!" }],
          })(
            <Input
              prefix={<Icon type="lock" style={iconColor} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator("confirm", {
            rules: [{ required: true, message: "Confirm the password" }],
          })(
            <Input
              prefix={<Icon type="lock" style={iconColor} />}
              type="password"
              placeholder="Confirm the password!"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Sign up
          </Button>
        </Form.Item>
        <Form.Item>
          <a href="/">Login now!</a>
          <a className="login-form-forgot" href="/forgotpwd">
            Forgot password
          </a>
        </Form.Item>
      </Form>
      <div className="loginMask"></div>
    </div>
  );
}

export default Form.create({ name: "admin_login" })(LoginForm);
