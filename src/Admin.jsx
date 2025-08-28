import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

function Admin() {
  const [orders, setOrders] = useState([])
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState('login') // login, dashboard
  const [showNotification, setShowNotification] = useState(false)

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders)
      console.log('Loaded orders from localStorage:', parsedOrders)
      setOrders(parsedOrders)
    } else {
      console.log('No orders found in localStorage')
    }
  }, [])

  // Auto-refresh orders every 5 seconds to check for new orders
  useEffect(() => {
    const interval = setInterval(() => {
      const savedOrders = localStorage.getItem('orders')
      if (savedOrders) {
        const newOrders = JSON.parse(savedOrders)
        if (newOrders.length !== orders.length) {
          console.log('New orders detected, updating...')
          setOrders(newOrders)
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 5000)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [orders.length])

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  const handleAdminLogin = () => {
    if (adminPassword === 'admin password') {
      setIsAdminLoggedIn(true)
      setCurrentView('dashboard')
      setAdminPassword('')
    } else {
      alert('Incorrect password!')
    }
  }

  const handleLogout = () => {
    setIsAdminLoggedIn(false)
    setCurrentView('login')
    setAdminPassword('')
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId))
    }
  }

  const refreshOrders = () => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      const newOrders = JSON.parse(savedOrders)
      console.log('Refreshed orders:', newOrders)
      const currentCount = orders.length
      const newCount = newOrders.length
      
      if (newCount > currentCount) {
        const newPendingOrders = newOrders.filter(o => o.status === 'pending').length
        alert(`🆕 New orders detected! You have ${newPendingOrders} pending orders to process.`)
      }
      
      setOrders(newOrders)
    } else {
      console.log('No orders found when refreshing')
    }
  }

  const renderLogin = () => (
    <div className="admin-login">
      <div className="login-container">
        <h1>🍕 Restaurant Admin</h1>
        <h2>🔐 Admin Login</h2>
        <div className="login-form">
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
          <button onClick={handleAdminLogin}>Login</button>
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div className="admin-dashboard">
      {showNotification && (
        <div className="notification" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#28a745',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '10px',
          zIndex: 1000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.5s ease'
        }}>
          🆕 New order received! Check pending orders.
        </div>
      )}
      <div className="admin-header">
        <div className="header-content">
          <h1>👨‍💼 Admin Dashboard</h1>
          <div className="admin-actions">
            <Link to="/" className="back-to-user">
              <span>👤</span>
              <span>User Dashboard</span>
            </Link>
            <button onClick={refreshOrders} className="refresh-btn">🔄 Refresh</button>
            <button onClick={() => {
              alert('To test the order flow:\n\n1. Go to User Dashboard (http://localhost:5175/)\n2. Add items to cart\n3. Fill customer information (Name & Table Number/Phone Number)\n4. Select payment method\n5. Click "Place Order"\n6. Come back to Admin Dashboard\n7. Click "Refresh" or wait 5 seconds\n\nYour order should appear in "Pending Orders"!')
            }} className="help-btn">❓ How to Test</button>
            <button onClick={() => {
              const testOrder = {
                id: 'TEST123',
                customer: {name: 'Test Customer', tableNumber: 'Table 5'},
                orderType: 'dine-in',
                paymentMethod: 'cash',
                items: [{id: 1, name: 'Test Pizza', price: 100, quantity: 1}],
                total: 100,
                status: 'pending',
                timestamp: new Date().toLocaleString(),
                orderNumber: '#TEST001'
              }
              const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
              const updatedOrders = [...existingOrders, testOrder]
              localStorage.setItem('orders', JSON.stringify(updatedOrders))
              setOrders(updatedOrders)
              alert('Test order added!')
            }} className="test-btn">🧪 Add Test Order</button>
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
          <span className="stat-label">📋 Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'preparing').length}</span>
          <span className="stat-label">🍳 Preparing</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'ready').length}</span>
          <span className="stat-label">✅ Ready</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{orders.filter(o => o.status === 'delivered').length}</span>
          <span className="stat-label">🚚 Delivered</span>
        </div>
        <div className="stat-card total">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">📊 Total Orders</span>
        </div>
      </div>

      <div className="orders-container">
        {/* DINE IN ORDERS */}
        <div className="order-type-section">
          <h1 className="section-title">🍽️ Dine In Orders</h1>
          
          <div className="orders-section">
            <h2>📋 Pending Dine In ({orders.filter(order => order.status === 'pending' && order.orderType === 'dine-in').length})</h2>
            {orders.filter(order => order.status === 'pending' && order.orderType === 'dine-in').length === 0 ? (
              <p className="no-orders">No pending dine in orders</p>
            ) : (
              orders.filter(order => order.status === 'pending' && order.orderType === 'dine-in').map(order => (
                <div key={order.id} className="order-card pending dine-in">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Table Number:</strong> {order.customer.tableNumber}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cash' ? '💵 Cash' : '💳 Online Payment'}</p>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₱{(item.price * item.quantity).toFixed(2).replace(/\.00$/, '')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <strong>Total: ₱{order.total.toFixed(2).replace(/\.00$/, '')}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="btn-preparing"
                    >
                      🍳 Start Preparing
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="btn-ready"
                    >
                      ✅ Mark Ready
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orders-section">
            <h2>🍳 Preparing Dine In ({orders.filter(order => order.status === 'preparing' && order.orderType === 'dine-in').length})</h2>
            {orders.filter(order => order.status === 'preparing' && order.orderType === 'dine-in').length === 0 ? (
              <p className="no-orders">No dine in orders being prepared</p>
            ) : (
              orders.filter(order => order.status === 'preparing' && order.orderType === 'dine-in').map(order => (
                <div key={order.id} className="order-card preparing dine-in">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Table Number:</strong> {order.customer.tableNumber}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cash' ? '💵 Cash' : '💳 Online Payment'}</p>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.name} x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="btn-ready"
                    >
                      ✅ Mark Ready
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orders-section">
            <h2>✅ Ready Dine In ({orders.filter(order => order.status === 'ready' && order.orderType === 'dine-in').length})</h2>
            {orders.filter(order => order.status === 'ready' && order.orderType === 'dine-in').length === 0 ? (
              <p className="no-orders">No dine in orders ready</p>
            ) : (
              orders.filter(order => order.status === 'ready' && order.orderType === 'dine-in').map(order => (
                <div key={order.id} className="order-card ready dine-in">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Table Number:</strong> {order.customer.tableNumber}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cash' ? '💵 Cash' : '💳 Online Payment'}</p>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="btn-delivered"
                    >
                      🍽️ Served
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orders-section">
            <h2>🍽️ Served Dine In ({orders.filter(order => order.status === 'delivered' && order.orderType === 'dine-in').length})</h2>
            {orders.filter(order => order.status === 'delivered' && order.orderType === 'dine-in').length === 0 ? (
              <p className="no-orders">No served dine in orders</p>
            ) : (
              orders.filter(order => order.status === 'delivered' && order.orderType === 'dine-in').map(order => (
                <div key={order.id} className="order-card delivered dine-in">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Table Number:</strong> {order.customer.tableNumber}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cash' ? '💵 Cash' : '💳 Online Payment'}</p>
                  </div>
                  <div className="order-total">
                    <strong>Total: ₱{order.total.toFixed(2).replace(/\.00$/, '')}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TAKE OUT ORDERS */}
        <div className="order-type-section">
          <h1 className="section-title">📦 Take Out Orders</h1>
          
          <div className="orders-section">
            <h2>📋 Pending Take Out ({orders.filter(order => order.status === 'pending' && order.orderType === 'take-out').length})</h2>
            {orders.filter(order => order.status === 'pending' && order.orderType === 'take-out').length === 0 ? (
              <p className="no-orders">No pending take out orders</p>
            ) : (
              orders.filter(order => order.status === 'pending' && order.orderType === 'take-out').map(order => (
                <div key={order.id} className="order-card pending take-out">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Phone Number:</strong> {order.customer.phone}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? '💰 Cash on Delivery (COD)' : '🏪 Pay at Pickup'}</p>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₱{(item.price * item.quantity).toFixed(2).replace(/\.00$/, '')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <strong>Total: ₱{order.total.toFixed(2).replace(/\.00$/, '')}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="btn-preparing"
                    >
                      🍳 Start Preparing
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="btn-ready"
                    >
                      ✅ Mark Ready
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orders-section">
            <h2>🍳 Preparing Take Out ({orders.filter(order => order.status === 'preparing' && order.orderType === 'take-out').length})</h2>
            {orders.filter(order => order.status === 'preparing' && order.orderType === 'take-out').length === 0 ? (
              <p className="no-orders">No take out orders being prepared</p>
            ) : (
              orders.filter(order => order.status === 'preparing' && order.orderType === 'take-out').map(order => (
                <div key={order.id} className="order-card preparing take-out">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Phone Number:</strong> {order.customer.phone}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? '💰 Cash on Delivery (COD)' : '🏪 Pay at Pickup'}</p>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.name} x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="btn-ready"
                    >
                      ✅ Mark Ready
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orders-section">
            <h2>📦 Ready to Pickup ({orders.filter(order => order.status === 'ready' && order.orderType === 'take-out').length})</h2>
            {orders.filter(order => order.status === 'ready' && order.orderType === 'take-out').length === 0 ? (
              <p className="no-orders">No take out orders ready for pickup</p>
            ) : (
              orders.filter(order => order.status === 'ready' && order.orderType === 'take-out').map(order => (
                <div key={order.id} className="order-card ready take-out">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Phone Number:</strong> {order.customer.phone}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? '💰 Cash on Delivery (COD)' : '🏪 Pay at Pickup'}</p>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="btn-delivered"
                    >
                      🚚 Mark Delivered
                    </button>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orders-section">
            <h2>🚚 Delivered Take Out ({orders.filter(order => order.status === 'delivered' && order.orderType === 'take-out').length})</h2>
            {orders.filter(order => order.status === 'delivered' && order.orderType === 'take-out').length === 0 ? (
              <p className="no-orders">No delivered take out orders</p>
            ) : (
              orders.filter(order => order.status === 'delivered' && order.orderType === 'take-out').map(order => (
                <div key={order.id} className="order-card delivered take-out">
                  <div className="order-header">
                    <h3>Order {order.orderNumber}</h3>
                    <span className="order-time">{order.timestamp}</span>
                  </div>
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customer.name}</p>
                    <p><strong>Phone Number:</strong> {order.customer.phone}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? '💰 Cash on Delivery (COD)' : '🏪 Pay at Pickup'}</p>
                  </div>
                  <div className="order-total">
                    <strong>Total: ₱{order.total.toFixed(2).replace(/\.00$/, '')}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-app">
      {currentView === 'login' ? renderLogin() : renderDashboard()}
    </div>
  )
}

export default Admin
