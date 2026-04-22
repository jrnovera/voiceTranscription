import React, { useState, useEffect } from 'react';
import { getAllUsers, setUserRole } from '../services/userService';
import './AdminPanel.css';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(uid, newRole) {
    try {
      setUpdating(uid);
      await setUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Error updating role:', err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <p className="admin-subtitle">Manage user roles and permissions</p>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="user-name">{user.name || 'N/A'}</td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="user-date">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updating === user.id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
