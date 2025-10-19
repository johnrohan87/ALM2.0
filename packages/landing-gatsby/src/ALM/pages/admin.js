import React, { useState } from "react";
import { Table, Button, message, Modal, Input, Switch } from "antd";
import {
  useFetchUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../store/api";
import NavigationBar from "../components/NavigationBar";
import withAuth from "../utils/withAuth";

const Admin = () => {
  const { data: users, refetch } = useFetchUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [isEditing, setIsEditing] = useState(null);
  const [editUser, setEditUser] = useState({});

  const handleEdit = (user) => {
    setIsEditing(user.id);
    setEditUser(user);
  };

  const handleSave = async () => {
    try {
      await updateUser({ userId: editUser.id, data: editUser }).unwrap();
      message.success("User updated successfully");
      setIsEditing(null);
      refetch();
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  const handleDelete = async (userId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will permanently delete the user.",
      onOk: async () => {
        try {
          await deleteUser(userId).unwrap();
          message.success("User deleted");
          refetch();
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (_, user) =>
        isEditing === user.id ? (
          <Input
            value={editUser.username}
            onChange={(e) =>
              setEditUser((prev) => ({ ...prev, username: e.target.value }))
            }
          />
        ) : (
          user.username
        ),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (_, user) =>
        isEditing === user.id ? (
          <Switch
            checked={editUser.is_active}
            onChange={(checked) =>
              setEditUser((prev) => ({ ...prev, is_active: checked }))
            }
          />
        ) : (
          user.is_active ? "Yes" : "No"
        ),
    },
    {
      title: "Actions",
      render: (_, user) => (
        <>
          {isEditing === user.id ? (
            <>
              <Button onClick={handleSave} type="primary">
                Save
              </Button>
              <Button onClick={() => setIsEditing(null)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleEdit(user)}>Edit</Button>
              <Button danger onClick={() => handleDelete(user.id)}>
                Delete
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <NavigationBar />
      <h1>Admin Panel - Manage Users</h1>
      <Table columns={columns} dataSource={users} rowKey="id" />
    </div>
  );
};

export default withAuth(Admin, true);