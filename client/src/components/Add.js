import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
//draft js part
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
//actions
import { addPost } from "../actions/postAction";
//ant part
import { Row, Col, Form, Input, Button, notification } from 'antd';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function Add(props) {
  const dispatch = useDispatch();
  //get notifications from store
  const message = useSelector(state => state.post.notification);
  console.log(message)
  //check if post variable passed from component (in case when we edit post)
  const post = props.location.state ? props.location.state.post : "";
  //if post passed, than get id and description
  const description = post ? post.description : ""
  const id = post ? post._id : ""

  //if post passed, than convert editor content, if not - create empty
  const editorContent = post ?
    EditorState.createWithContent(convertFromRaw(JSON.parse(description))) :
    EditorState.createEmpty();

  //local state of editor
  const [editorState, setEditorState] = useState({ editorState: editorContent });
  //local state of topic
  const [topic, setTopic] = useState(post.topic);

  //change local state of editor
  const handleEditorChange = (editorState) => {
    setEditorState({ editorState });
  }

  //runs when we click Add post button
  const onSubmit = () => {
    const newPost = {
      id,
      topic,
      description: JSON.stringify(convertToRaw(editorState.editorState.getCurrentContent())),
    };
    console.log(convertToRaw(editorState.editorState.getCurrentContent()))
    //dispatches addPost action 
    dispatch(addPost(newPost));
  }

  useEffect(() => {
    //if notification in store changed it state
    if (message.type) {
      //then show it
      notification[message.type]({
        duration: 1,
        message: <span>{message.message}</span>
      });
    }
  }, [message])

  return (
    <Row justify="center">
      <Col span="12">
        <Form
          onFinish={onSubmit}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ topic }}
        >
          <Form.Item
            label="Topic"
            name="topic"
          >
            {/* change local statof input */}
            <Input onChange={e => setTopic(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Editor
              editorState={editorState.editorState}
              onEditorStateChange={handleEditorChange}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
            />
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            {/* submits form */}
            <Button type="primary" htmlType="submit">Add post</Button>
          </div>
        </Form>
      </Col>
    </Row>

  );
}

export default Add;