import { Button, Form, Image, Input, Modal, Space, Table, Upload, message } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

import uploadFile from "../../utils/upload";
import Link from "antd/es/typography/Link";

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
      render: (values) => <Image width={200} src={values} />,
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
      render: (values) => (
        <Link href={values} target="_blank">
          {values}
        </Link>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Space>
          <Button
            onClick={() => {
              handleDeleteCourse(id);
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
  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
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
    const url = await uploadFile(values.poster.file.originFileObj);
    console.log(url);
    values.poster = url;
    const response = await axios.post("https://6627a8d5b625bf088c092ecf.mockapi.io/Course", values);
    setCourseList([...courseList, values]);
    formTag.resetFields();
    handleCloseModal();
  }
  //-------------------------------------------------------------------

  //-----------------------------DELETE--------------------------------

  async function handleDeleteCourse(id) {
    const response = await axios.delete(`https://6627a8d5b625bf088c092ecf.mockapi.io/Course/${id}`);
    setCourseList(courseList.filter((course) => course.id !== id));
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
    let check = Boolean(false);
    let poster_url;
    let courseListAfterEdit = []; // tạo array rỗng của danh sách course sau khi edit
    courseListAfterEdit = courseList.map((course) => {
      // dùng courseList.map để gán một array sau khi update cho courseList
      if (course.id === courseEdit.id) {
        check = true;

        return courseEdit;
      } else {
        return course;
      }
    });

    //-------------------------------------------CẬP NHẬT TRÊN API--------------------------------
    if (check === true) {
      const response = await axios.put(`https://6627a8d5b625bf088c092ecf.mockapi.io/Course/${courseEdit.id}`, {
        name: courseEdit.name,
        poster: courseEdit.poster,
        category: courseEdit.category,
        price: courseEdit.price,
        preview: courseEdit.preview,
      }); // tách đoạn code request tới database để tối ưu về mặt render
    }
    //-------------------------------IN RA DANH SÁCH SAU KHI EDIT BÊN PHÍA CLIENT -------------------
    setCourseList(courseListAfterEdit);
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
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
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
          <Form.Item label="Enter poster ">
            <Upload
              {...props}
              onChange={async (e) => {
                // Xử lí chuyển file về url
                let poster_url = await uploadFile(e.file.originFileObj);
                setCourseEdit((courseEdit) => {
                  return { ...courseEdit, poster: poster_url };
                });
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Enter category ">
            <Input
              value={courseEdit?.category}
              onChange={(e) => {
                setCourseEdit((courseEdit) => {
                  return { ...courseEdit, category: e.target.value };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Enter price ">
            <Input
              type="number"
              value={courseEdit?.price}
              onChange={(e) => {
                setCourseEdit((courseEdit) => {
                  return { ...courseEdit, price: e.target.valueAsNumber };
                });
              }}
            />
          </Form.Item>
          <Form.Item label="Enter preview ">
            <Input
              value={courseEdit?.preview}
              onChange={(e) => {
                setCourseEdit((courseEdit) => {
                  return { ...courseEdit, preview: e.target.value };
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
