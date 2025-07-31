import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Base URL for your Spring Boot backend API
const API_BASE_URL = 'http://localhost:8081/api/items';

// --- ItemService.js ---
// This service handles all API calls to the backend
const ItemService = {
  getAllItems: () => {
    return axios.get(API_BASE_URL);
  },
  getItemById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },
  createItem: (item) => {
    return axios.post(API_BASE_URL, item);
  },
  updateItem: (id, item) => {
    return axios.put(`${API_BASE_URL}/${id}`, item);
  },
  deleteItem: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

// --- ItemList.js ---
// Component to display a list of items
const ItemList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await ItemService.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error("خطا در دریافت لیست آیتم‌ها:", error);
      // Optionally, display an error message to the user
    }
  };

  const handleDelete = async (id) => {
    // Use a custom confirmation dialog instead of alert/confirm
    if (window.confirm("آیا از حذف این آیتم اطمینان دارید؟")) {
      try {
        await ItemService.deleteItem(id);
        fetchItems(); // Refresh the list after deletion
      } catch (error) {
        console.error("خطا در حذف آیتم:", error);
      }
    }
  };

  return (
      <div className="container mt-4">
        <h2 className="mb-4">لیست آیتم‌ها</h2>
        <Link to="/add" className="btn btn-primary mb-3">افزودن آیتم جدید</Link>
        {items.length === 0 ? (
            <p>هیچ آیتمی برای نمایش وجود ندارد.</p>
        ) : (
            <ul className="list-group">
              {items.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name} - {item.description}
                    <div>
                      <button
                          onClick={() => navigate(`/edit/${item.id}`)}
                          className="btn btn-info btn-sm me-2"
                      >
                        ویرایش
                      </button>
                      <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-danger btn-sm"
                      >
                        حذف
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

// --- ItemForm.js ---
// Component for adding and editing items
const ItemForm = ({ isEditing }) => {
  const [item, setItem] = useState({ name: '', description: '' });
  const navigate = useNavigate();
  const { id } = isEditing ? useParams() : { id: null }; // Get ID from URL for editing

  useEffect(() => {
    if (isEditing && id) {
      fetchItem(id);
    }
  }, [isEditing, id]);

  const fetchItem = async (itemId) => {
    try {
      const response = await ItemService.getItemById(itemId);
      setItem(response.data);
    } catch (error) {
      console.error("خطا در دریافت آیتم برای ویرایش:", error);
      navigate('/items'); // Redirect if item not found or error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prevItem => ({ ...prevItem, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await ItemService.updateItem(id, item);
      } else {
        await ItemService.createItem(item);
      }
      navigate('/items'); // Redirect to list after save/update
    } catch (error) {
      console.error("خطا در ذخیره آیتم:", error);
    }
  };

  return (
      <div className="container mt-4">
        <h2 className="mb-4">{isEditing ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">نام:</label>
            <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">توضیحات:</label>
            <textarea
                className="form-control"
                id="description"
                name="description"
                value={item.description}
                onChange={handleChange}
                rows="3"
                required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success me-2">
            {isEditing ? 'ذخیره تغییرات' : 'افزودن آیتم'}
          </button>
          <Link to="/items" className="btn btn-secondary">بازگشت به لیست</Link>
        </form>
      </div>
  );
};

// --- App.js ---
// Main application component with routing
function App() {
  return (
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/items">پروژه CRUD</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/items">آیتم‌ها</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">افزودن آیتم</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<ItemList />} /> {/* Default route */}
            <Route path="/items" element={<ItemList />} />
            <Route path="/add" element={<ItemForm isEditing={false} />} />
            <Route path="/edit/:id" element={<ItemForm isEditing={true} />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
