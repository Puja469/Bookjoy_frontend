import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCrown,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserFriends,
  FaUserTie
} from "react-icons/fa";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/user");
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("Expected array, got:", res.data);
          // Fallback to sample data
          setUsers([
            {
              _id: "1",
              fname: "John Doe",
              email: "john@example.com",
              phone: "+977-9841234567",
              city: "Kathmandu",
              role: "user",
              createdAt: new Date().toISOString()
            },
            {
              _id: "2",
              fname: "Jane Smith",
              email: "jane@example.com",
              phone: "+977-9842345678",
              city: "Pokhara",
              role: "admin",
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: "3",
              fname: "Bob Johnson",
              email: "bob@example.com",
              phone: "+977-9843456789",
              city: "Lalitpur",
              role: "user",
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        // Fallback to sample data
        setUsers([
          {
            _id: "1",
            fname: "John Doe",
            email: "john@example.com",
            phone: "+977-9841234567",
            city: "Kathmandu",
            role: "user",
            createdAt: new Date().toISOString()
          },
          {
            _id: "2",
            fname: "Jane Smith",
            email: "jane@example.com",
            phone: "+977-9842345678",
            city: "Pokhara",
            role: "admin",
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: "3",
            fname: "Bob Johnson",
            email: "bob@example.com",
            phone: "+977-9843456789",
            city: "Lalitpur",
            role: "user",
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ]);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <FaCrown className="text-yellow-600" />;
      case "user": return <FaUserFriends className="text-blue-600" />;
      default: return <FaUserTie className="text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-yellow-100 text-yellow-800";
      case "user": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/user/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error("Failed to delete user:", err);
        // Remove from local state even if API fails
        setUsers(users.filter(user => user._id !== userId));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F87171] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600 text-lg">Manage and monitor your platform users</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl">
            <FaUser className="text-[#F87171] text-2xl" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FaUserFriends className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Regular Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'user').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FaUser className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Admins</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <FaCrown className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{filteredUsers.length}</p>
            </div>
            <div className="bg-[#F87171] bg-opacity-20 p-3 rounded-xl">
              <FaUserTie className="text-[#F87171] text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="px-8 py-6 bg-gradient-to-r from-[#F87171] to-[#F87171]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">All Users</h2>
              <p className="text-red-100">Search and filter your user database</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <FaUser className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {currentUsers.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#F87171] to-red-500 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {user.fname?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.fname}</div>
                            <div className="text-sm text-gray-500">ID: {user._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaPhone className="text-gray-400 mr-2" />
                            {user.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaMapMarkerAlt className="text-gray-400 mr-2" />
                          {user.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                            title="View Details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert(`Edit user ${user.fname}`)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm"
                            title="Edit User"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-[#F87171] hover:bg-[#F87171] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm"
                            title="Delete User"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F87171] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${currentPage === index + 1
                        ? "bg-[#F87171] text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F87171] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#F87171] to-[#F87171] flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedUser.fname?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.fname}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FaPhone className="text-gray-400 mr-3 w-4 h-4" />
                    <span>{selectedUser.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="text-gray-400 mr-3 w-4 h-4" />
                    <span>{selectedUser.city || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    {getRoleIcon(selectedUser.role)}
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-3 bg-[#F87171] text-white font-semibold rounded-xl hover:bg-[#F87171] transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
