import { useState } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [currentStep, setCurrentStep] = useState('catalog') // catalog, cart, checkout, confirmation
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    tableNumber: ''
  })
  const [orderType, setOrderType] = useState('dine-in') // 'dine-in' or 'take-out'
  const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash', 'online', 'cod', or 'pay-at-pickup'
  const [currentOrderNumber, setCurrentOrderNumber] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')


  // Sample product data
  const products = [
    // Main Dishes
    { id: 1, name: 'Pizza Margherita', price: 649.50, description: 'Classic tomato and mozzarella', category: 'main' },
    { id: 2, name: 'Burger Deluxe', price: 799.50, description: 'Beef burger with fries', category: 'main' },
    { id: 3, name: 'Caesar Salad', price: 449.50, description: 'Fresh greens with dressing', category: 'main' },
    { id: 4, name: 'Pasta Carbonara', price: 699.50, description: 'Creamy pasta with bacon', category: 'main' },
    { id: 5, name: 'Chicken Adobo', price: 599.50, description: 'Traditional Filipino chicken dish', category: 'main' },
    { id: 6, name: 'Beef Tapa', price: 749.50, description: 'Cured beef with garlic rice and egg', category: 'main' },
    
    // Coffee
    { id: 7, name: 'Espresso', price: 149.50, description: 'Single shot of pure coffee', category: 'coffee' },
    { id: 8, name: 'Cappuccino', price: 199.50, description: 'Espresso with steamed milk foam', category: 'coffee' },
    { id: 9, name: 'Latte', price: 219.50, description: 'Espresso with steamed milk', category: 'coffee' },
    { id: 10, name: 'Americano', price: 169.50, description: 'Espresso with hot water', category: 'coffee' },
    { id: 11, name: 'Mocha', price: 239.50, description: 'Espresso with chocolate and milk', category: 'coffee' },
    { id: 12, name: 'Caramel Macchiato', price: 259.50, description: 'Espresso with caramel and milk', category: 'coffee' },
    
    // Desserts
    { id: 13, name: 'Chocolate Cake', price: 299.50, description: 'Rich chocolate layer cake', category: 'dessert' },
    { id: 14, name: 'Tiramisu', price: 349.50, description: 'Italian coffee-flavored dessert', category: 'dessert' },
    { id: 15, name: 'Cheesecake', price: 329.50, description: 'Creamy New York style cheesecake', category: 'dessert' },
    { id: 16, name: 'Ice Cream Sundae', price: 279.50, description: 'Vanilla ice cream with toppings', category: 'dessert' },
    { id: 17, name: 'Halo-Halo', price: 259.50, description: 'Filipino mixed dessert with shaved ice', category: 'dessert' },
    { id: 18, name: 'Leche Flan', price: 189.50, description: 'Filipino caramel custard', category: 'dessert' }
  ]

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = () => {
    if (customerInfo.name && ((orderType === 'dine-in' && customerInfo.tableNumber) || (orderType === 'take-out' && customerInfo.phone))) {
      const orderNumber = `#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      const newOrder = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        customer: customerInfo,
        orderType: orderType,
        paymentMethod: paymentMethod,
        items: cart,
        total: getCartTotal(),
        status: 'pending',
        timestamp: new Date().toLocaleString(),
        orderNumber: orderNumber
      }
      
      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedOrders = [...existingOrders, newOrder]
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      console.log('Order saved to localStorage:', newOrder)
      console.log('All orders in localStorage:', updatedOrders)
      
      // Store the order number for confirmation display
      setCurrentOrderNumber(orderNumber)
      setCurrentStep('confirmation')
    }
  }

  const renderCatalog = () => {
    const filteredProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory)

    return (
      <div className="catalog">
        <h2>Our Menu</h2>
        
        {/* Category Filters */}
        <div className="category-filters">
          <button 
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            🍽️ All Items
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'main' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('main')}
          >
            🍕 Main Dishes
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'coffee' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('coffee')}
          >
            ☕ Coffee
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'dessert' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('dessert')}
          >
            🍰 Desserts
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-category">
                {product.category === 'main' && '🍕'}
                {product.category === 'coffee' && '☕'}
                {product.category === 'dessert' && '🍰'}
              </div>
              <div className="category-label">
                {product.category === 'main' && 'Main Dish'}
                {product.category === 'coffee' && 'Coffee'}
                {product.category === 'dessert' && 'Dessert'}
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">₱{product.price.toFixed(2).replace(/\.00$/, '')}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No items found in this category.</p>
          </div>
        )}
        
        <button 
          className="cart-button"
          onClick={() => setCurrentStep('cart')}
          disabled={cart.length === 0}
        >
          🛒 View Cart ({cart.length} items)
        </button>
      </div>
    )
  }

  const renderCart = () => (
    <div className="cart">
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>₱{item.price.toFixed(2).replace(/\.00$/, '')} each</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ₱{getCartTotal().toFixed(2).replace(/\.00$/, '')}</h3>
          </div>
          <div className="cart-actions">
                    <button onClick={() => setCurrentStep('catalog')}>🛍️ Continue Shopping</button>
        <button onClick={() => setCurrentStep('checkout')}>💳 Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  )

  const renderCheckout = () => (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} className="summary-item">
            <span>{item.name} x{item.quantity}</span>
            <span>₱{(item.price * item.quantity).toFixed(2).replace(/\.00$/, '')}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total: ₱{getCartTotal().toFixed(2).replace(/\.00$/, '')}</strong>
        </div>
      </div>
      
      <div className="customer-form">
        <h3>Customer Information</h3>
        
        <div className="order-type-selection">
          <h4>Order Type</h4>
          <div className="order-type-buttons">
            <button
              type="button"
              className={`order-type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
              onClick={() => setOrderType('dine-in')}
            >
              🍽️ Dine In
            </button>
            <button
              type="button"
              className={`order-type-btn ${orderType === 'take-out' ? 'active' : ''}`}
              onClick={() => setOrderType('take-out')}
            >
              📦 Take Out
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
        />
        {orderType === 'dine-in' ? (
          <>
            <input
              type="text"
              placeholder="Table Number"
              value={customerInfo.tableNumber}
              onChange={(e) => setCustomerInfo({...customerInfo, tableNumber: e.target.value})}
            />
            
            <div className="payment-method-selection">
              <h4>Payment Method</h4>
              <div className="payment-method-buttons">
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'online' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('online')}
                >
                  💳 Online Payment
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerInfo.phone || ''}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            />
            
            <div className="payment-method-selection">
              <h4>Payment Method</h4>
              <div className="payment-method-buttons">
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  💰 Cash on Delivery (COD)
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'pay-at-pickup' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('pay-at-pickup')}
                >
                  🏪 Pay at Pickup
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="checkout-actions">
        <button onClick={() => setCurrentStep('cart')}>🛒 Back to Cart</button>
        <button onClick={handleCheckout}>✅ Place Order</button>
      </div>
    </div>
  )

  

  const renderConfirmation = () => (
    <div className="confirmation">
      <h2>✅ Order Confirmed!</h2>
      <p className="success-message">Your order has been sent to the restaurant and is now pending. The admin will update the status soon!</p>

      <div className="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {currentOrderNumber}</p>
        <p><strong>Order Type:</strong> {orderType === 'dine-in' ? '🍽️ Dine In' : '📦 Take Out'}</p>
        <p><strong>Customer:</strong> {customerInfo.name}</p>
        {orderType === 'dine-in' ? (
          <>
            <p><strong>Table Number:</strong> {customerInfo.tableNumber}</p>
            <p><strong>Payment Method:</strong> {paymentMethod === 'cash' ? '💵 Cash' : '💳 Online Payment'}</p>
          </>
        ) : (
          <>
            <p><strong>Phone Number:</strong> {customerInfo.phone}</p>
            <p><strong>Payment Method:</strong> {paymentMethod === 'cod' ? '💰 Cash on Delivery (COD)' : '🏪 Pay at Pickup'}</p>
          </>
          )}
        
        <h4>Items Ordered:</h4>
        {cart.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name} x{item.quantity}</span>
            <span>₱{(item.price * item.quantity).toFixed(2).replace(/\.00$/, '')}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total: ₱{getCartTotal().toFixed(2).replace(/\.00$/, '')}</strong>
        </div>
      </div>
      
      <button onClick={() => {
        setCart([])
        setCustomerInfo({name: '', tableNumber: '', phone: ''})
        setOrderType('dine-in')
        setPaymentMethod('cash')
        setCurrentOrderNumber('')
        setCurrentStep('catalog')
      }}>
        🆕 Start New Order
      </button>
    </div>
  )

  return (
    <div className="app">
      <header>
        <h1>🍕 Food Ordering System</h1>
        <nav>
          <button 
            onClick={() => setCurrentStep('catalog')}
            className={currentStep === 'catalog' ? 'active' : ''}
          >
            Menu
          </button>
          <button 
            onClick={() => setCurrentStep('cart')}
            className={currentStep === 'cart' ? 'active' : ''}
            disabled={cart.length === 0}
          >
            🛒 Cart ({cart.length})
          </button>

        </nav>
      </header>

      <main>
        {currentStep === 'catalog' && renderCatalog()}
        {currentStep === 'cart' && renderCart()}
        {currentStep === 'checkout' && renderCheckout()}
        {currentStep === 'confirmation' && renderConfirmation()}
      </main>
    </div>
  )
}

export default App
