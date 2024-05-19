import { Button, Form, Input, Modal, Space, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";

function CourseMng() {
  const [courseList, setCourseList] = useState([]);
  //----------------------<ADD COMPONENT> ---------------------
  const [visibleModal, setVisibleModal] = useState(false);
  const [formTag] = useForm();
  //----------------------<ADD COMPONENT/> ---------------------
  //----------------------<UPDATE COMPONENT> ---------------------
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [courseEdit, setCourseEdit] = useState(null); // tạo biến tạm courseEdit
  //----------------------<UPDATE COMPONENT/> ---------------------
  const courseProperties = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Preview",
      dataIndex: "preview",
      key: "preview",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              handleDeleteCourse(record);
            }}
            type="primary"
            danger
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              handleOnEdit(record); // Gọi hàm handleOnEdit khi click vào Button Edit
            }}
            type="primary"
            style={{ background: "orange" }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];
  //------------------------------FETCH DATA -----------------------
  async function fetchCourse() {
    const response = await axios.get("https://6627a8d5b625bf088c092ecf.mockapi.io/Course");
    setCourseList(response.data);
  }
  useEffect(() => {
    fetchCourse();
  }, []);

  //------------------------------ADD-------------------------------
  function handleOpenModal() {
    setVisibleModal(true);
  }
  function handleCloseModal() {
    setVisibleModal(false);
  }
  function handleOkButton() {
    formTag.submit();
  }
  async function handleAddNewCourse(values) {
    const response = await axios.post("https://6627a8d5b625bf088c092ecf.mockapi.io/Course", values);
    fetchCourse();
    formTag.resetFields();
    handleCloseModal();
  }
  //-------------------------------------------------------------------

  //-----------------------------DELETE--------------------------------

  async function handleDeleteCourse(record) {
    const response = await axios.delete(`https://6627a8d5b625bf088c092ecf.mockapi.io/Course/${record.id}`);
    fetchCourse();
  }
  //-------------------------------------------------------------------

  //--------------------------UPDATE-----------------------------------
  function handleOpenEditModal() {
    setVisibleEditModal(true);
  }

  function handleCloseEditModal() {
    setVisibleEditModal(false);
  }

  function handleOnEdit(record) {
    setCourseEdit({ ...record }); // Copy dữ liệu hiện tại của record vào biến tạm : courseEdit
    // Giờ đây biến tạm đang mang tất cả các giá trị của record

    handleOpenEditModal();
  }
  function handleResetEditing() {
    // dùng để gắn vào event onCancel
    setCourseEdit(null); // mỗi khi cancel thì sẽ cho biến tạm về null tránh trùng lặp với giá trị cũ
    handleCloseEditModal();
  }

  async function handleEditCourse() {
    const response = await axios.put(`https://6627a8d5b625bf088c092ecf.mockapi.io/Course/${courseEdit.id}`, {
      name: courseEdit.name,
      poster: courseEdit.poster,
      category: courseEdit.category,
      price: courseEdit.price,
      preview: courseEdit.preview,
    });
    fetchCourse();
    handleResetEditing();
  }

  //-------------------------------------------------------------------

  return (
    <div>
      <Button onClick={handleOpenModal} type="primary">
        Add new course
      </Button>
      <Modal title="Add course" open={visibleModal} onCancel={handleCloseModal} onOk={handleOkButton}>
        <Form form={formTag} onFinish={handleAddNewCourse}>
          <Form.Item label="Name: " name="name">
            <Input />
          </Form.Item>
          <Form.Item label=" Poster " name="poster">
            <Input />
          </Form.Item>
          <Form.Item label=" Category " name="category">
            <Input />
          </Form.Item>
          <Form.Item label=" Price " name="price">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Preview" name="preview">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit course"
        open={visibleEditModal}
        onCancel={handleResetEditing}
        onOk={handleEditCourse}
        okText={"Save"}
      >
        {/* Dựng Modal cho chức năng Update */}
        <Form>
          <Form.Item label="Enter name ">
            {/* value={courseEdit?.name } : lấy giá trị của biến tạm ( ? dùng cho việc xác định null) để show lên cho user và reset mỗi lần thay đổi đối tượng update */}
            <Input
              value={courseEdit?.name}
              onChange={(e) => {
                setCourseEdit((courseEdit) => {
                  return { ...courseEdit, name: e.target.value };
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={courseProperties} dataSource={courseList} />;
    </div>
  );
}

export default CourseMng;
