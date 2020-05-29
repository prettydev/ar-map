import React from "react";
import { Form, Input, Button, Upload, Icon, message } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { uploadConfig, addBuilding } from "../../utils/api";
import { useQuery } from "../../utils/index";

import "./index.scss";
import { userInfo } from "os";
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

function AddBuilding(props: any) {
  const form = props.form;
  const query = useQuery();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);

    const { data } = await addBuilding(formData);
    if (data.code) {
      message.success(data.message);
      // props.history.push("/buildings");
    }
  }

  const [selectedFile, setSelectedFile] = React.useState();
  // const [loaded, setLoaded] = React.useState(0);

  const onChangeHandler = (event) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      layout="horizontal"
      {...formItemLayout}
      className="addStuffPost"
    >
      <Form.Item label="attach">
        <input type="file" name="file" onChange={onChangeHandler} />
      </Form.Item>

      <div className="btnbox">
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </div>
    </Form>
  );
}

export default Form.create({ name: "addBuilding" })(AddBuilding);
