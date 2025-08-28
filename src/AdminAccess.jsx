import { Link } from 'react-router-dom'
import './AdminAccess.css'

function AdminAccess() {
  return (
    <div className="admin-access-page">
      <div className="access-container">
        <div className="access-header">
          <h1>🍕 Restaurant Management</h1>
          <p>Choose your access level</p>
        </div>
        
        <div className="access-options">
          <Link to="/" className="access-card user-access">
            <div className="access-icon">👤</div>
            <h2>User Dashboard</h2>
            <p>Browse menu, place orders, and track your food</p>
            <div className="access-features">
              <span>• Browse menu items</span>
              <span>• Add items to cart</span>
              <span>• Place orders</span>
              <span>• Track order status</span>
            </div>
          </Link>
          
          <Link to="/admin" className="access-card admin-access">
            <div className="access-icon">👨‍💼</div>
            <h2>Admin Dashboard</h2>
            <p>Manage orders, update status, and view statistics</p>
            <div className="access-features">
              <span>• View all orders</span>
              <span>• Update order status</span>
              <span>• Manage inventory</span>
              <span>• View analytics</span>
            </div>
          </Link>
        </div>
        
        <div className="access-footer">
          <p>Select the dashboard that matches your role</p>
        </div>
      </div>
    </div>
  )
}

export default AdminAccess
