const { useState, useEffect } = React;

function LoginForm({ onLogin }) {
    const [formData, setFormData] = useState({
        tokenId: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/login/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setTimeout(() => {
                    onLogin(data);
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo">
                        <i className="fas fa-cube"></i>
                    </div>
                    <h1>ProductFlow</h1>
                    <p>Sign in to your admin dashboard</p>
                </div>

                {message && (
                    <div className={`message ${message.type}`}>
                        <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tokenId">Token ID</label>
                        <div className="input-wrapper">
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                id="tokenId"
                                name="tokenId"
                                value={formData.tokenId}
                                onChange={handleChange}
                                required
                                placeholder="Enter your token ID"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading && <div className="spinner"></div>}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function DashboardLayout({ children, title, subtitle, breadcrumb, userData, onLogout }) {
    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <div className="dashboard-header-content">
                    <div className="dashboard-logo">
                        <div className="logo-icon">
                            <i className="fas fa-cube"></i>
                        </div>
                        ProductFlow
                    </div>
                    <nav className="dashboard-nav">
                        <div className="user-menu">
                            <i className="fas fa-user-circle"></i>
                            <span>{userData.tokenId}</span>
                        </div>
                        <button onClick={onLogout} className="btn btn-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            Sign Out
                        </button>
                    </nav>
                </div>
            </header>
            <main className="dashboard-main">
                {breadcrumb && (
                    <nav className="breadcrumb">
                        {breadcrumb.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <i className="fas fa-chevron-right"></i>}
                                {item.href ? (
                                    <a href="#" onClick={item.onClick}>{item.label}</a>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                <div className="page-header">
                    <h1 className="page-title">{title}</h1>
                    {subtitle && <p className="page-subtitle">{subtitle}</p>}
                </div>
                {children}
            </main>
        </div>
    );
}

function ProductDefinition({ onProductCreated, onBack }) {
    const [productName, setProductName] = useState('');
    const [parameterCount, setParameterCount] = useState(1);
    const [parameters, setParameters] = useState([{ parameterName: '', dataType: 'String', range: '' }]);
    const [loading, setLoading] = useState(false);

    const handleParameterCountChange = (e) => {
        const count = parseInt(e.target.value);
        setParameterCount(count);
        
        const newParameters = [];
        for (let i = 0; i < count; i++) {
            newParameters.push(parameters[i] || { parameterName: '', dataType: 'String', range: '' });
        }
        setParameters(newParameters);
    };

    const handleParameterChange = (index, field, value) => {
        const newParameters = [...parameters];
        newParameters[index][field] = value;
        setParameters(newParameters);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/login/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: productName,
                    parameters: parameters
                })
            });

            const data = await response.json();
            onProductCreated(data);
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumb = [
        { label: 'Dashboard', href: true, onClick: onBack },
        { label: 'Create Product' }
    ];

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">
                    <i className="fas fa-plus-circle"></i>
                    Create New Product
                </div>
                <div className="card-description">
                    Define your product and its parameters
                </div>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-title">
                            <i className="fas fa-tag"></i>
                            Product Information
                        </div>
                        <div className="form-grid form-grid-cols-2">
                            <div className="form-group">
                                <label htmlFor="productName">Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="parameterCount">Number of Parameters</label>
                                <input
                                    type="number"
                                    id="parameterCount"
                                    min="1"
                                    max="10"
                                    value={parameterCount}
                                    onChange={handleParameterCountChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <i className="fas fa-cogs"></i>
                            Parameter Definitions
                        </div>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Parameter Name</th>
                                        <th>Data Type</th>
                                        <th>Range/Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parameters.map((param, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={param.parameterName}
                                                    onChange={(e) => handleParameterChange(index, 'parameterName', e.target.value)}
                                                    required
                                                    placeholder="Parameter name"
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={param.dataType}
                                                    onChange={(e) => handleParameterChange(index, 'dataType', e.target.value)}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                                >
                                                    <option value="String">String</option>
                                                    <option value="Number">Number</option>
                                                    <option value="Boolean">Boolean</option>
                                                    <option value="Date">Date</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={param.range}
                                                    onChange={(e) => handleParameterChange(index, 'range', e.target.value)}
                                                    placeholder="e.g., 1-100, true/false"
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={onBack}
                            className="btn btn-secondary"
                        >
                            <i className="fas fa-arrow-left"></i>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading && <div className="spinner"></div>}
                            {loading ? 'Creating...' : 'Create Product'}
                            <i className="fas fa-check"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ProductValueEntry({ product, onBack }) {
    const [showForm, setShowForm] = useState(false);
    const [values, setValues] = useState([]);
    const [savedValues, setSavedValues] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSavedValues();
    }, []);

    const fetchSavedValues = async () => {
        try {
            const response = await fetch(`/login/products/${product.id}/values`);
            const data = await response.json();
            setSavedValues(data);
        } catch (error) {
            console.error('Error fetching values:', error);
        }
    };

    const handleAddParameter = () => {
        const newValues = product.parameters.map(param => ({
            name: '',
            parameterId: param.id,
            value: ''
        }));
        setValues(newValues);
        setShowForm(true);
    };

    const handleValueChange = (index, field, value) => {
        const newValues = [...values];
        newValues[index][field] = value;
        setValues(newValues);
    };

    const handleSaveValues = async () => {
        setLoading(true);
        try {
            await fetch(`/login/products/${product.id}/values`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    values: values
                })
            });
            
            setShowForm(false);
            fetchSavedValues();
        } catch (error) {
            console.error('Error saving values:', error);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumb = [
        { label: 'Dashboard', href: true, onClick: onBack },
        { label: product.productName }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold">{product.productName}</h2>
                    <p className="text-sm text-neutral-600">{product.parameters.length} parameters defined</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleAddParameter} 
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus"></i>
                        Add Values
                    </button>
                    <button 
                        onClick={onBack} 
                        className="btn btn-secondary"
                    >
                        <i className="fas fa-arrow-left"></i>
                        Back
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card mb-6">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="fas fa-edit"></i>
                            Add Parameter Values
                        </div>
                        <div className="card-description">
                            Enter values for all parameters
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        {product.parameters.map(param => (
                                            <th key={param.id}>{param.parameterName}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                value={values[0]?.name || ''}
                                                onChange={(e) => handleValueChange(0, 'name', e.target.value)}
                                                placeholder="Enter name"
                                                style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                            />
                                        </td>
                                        {product.parameters.map((param, index) => (
                                            <td key={param.id}>
                                                <input
                                                    type="text"
                                                    value={values[index]?.value || ''}
                                                    onChange={(e) => handleValueChange(index, 'value', e.target.value)}
                                                    placeholder={`Enter ${param.parameterName}`}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.5rem' }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setShowForm(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveValues} 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading && <div className="spinner"></div>}
                                {loading ? 'Saving...' : 'Save Values'}
                                <i className="fas fa-save"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="fas fa-database"></i>
                        Saved Parameter Values
                    </div>
                    <div className="card-description">
                        {savedValues.length} value entries
                    </div>
                </div>
                <div className="card-body">
                    {savedValues.length > 0 ? (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Parameter</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedValues.map((value, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <i className="fas fa-tag text-primary-600 text-sm"></i>
                                                    </div>
                                                    <span className="font-medium">{value.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-sm text-neutral-600">{value.parameterName}</span>
                                            </td>
                                            <td>
                                                <span className="font-medium">{value.value}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <i className="fas fa-database"></i>
                            </div>
                            <div className="empty-state-title">No values yet</div>
                            <div className="empty-state-description">
                                Add parameter values to get started with this product.
                            </div>
                            <button 
                                onClick={handleAddParameter}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-plus"></i>
                                Add First Values
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductList({ onProductSelect, onCreateNew }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/login/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                Loading products...
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold">Product Management</h2>
                    <p className="text-sm text-neutral-600">{products.length} products available</p>
                </div>
                <button onClick={onCreateNew} className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    Create Product
                </button>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-3">
                    {products.map(product => (
                        <div 
                            key={product.id} 
                            className="card product-card"
                            onClick={() => onProductSelect(product)}
                        >
                            <div className="card-body">
                                <div className="product-card-icon">
                                    <i className="fas fa-cube"></i>
                                </div>
                                <div className="product-card-title">{product.productName}</div>
                                <div className="product-card-meta">
                                    <i className="fas fa-cogs"></i>
                                    {product.parameters.length} parameters
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <i className="fas fa-cube"></i>
                            </div>
                            <div className="empty-state-title">No products yet</div>
                            <div className="empty-state-description">
                                Create your first product to get started with parameter management.
                            </div>
                            <button 
                                onClick={onCreateNew}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-plus"></i>
                                Create First Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Dashboard({ userData, onLogout }) {
    const [currentView, setCurrentView] = useState('main');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductCreated = (product) => {
        setSelectedProduct(product);
        setCurrentView('productValueEntry');
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setCurrentView('productValueEntry');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'productList':
                return (
                    <DashboardLayout 
                        title="Products" 
                        subtitle="Manage your product catalog and parameters"
                        userData={userData} 
                        onLogout={onLogout}
                    >
                        <ProductList 
                            onProductSelect={handleProductSelect}
                            onCreateNew={() => setCurrentView('productDefinition')}
                        />
                    </DashboardLayout>
                );
            case 'productDefinition':
                return (
                    <DashboardLayout 
                        title="Create Product" 
                        subtitle="Define a new product and its parameters"
                        userData={userData} 
                        onLogout={onLogout}
                    >
                        <ProductDefinition 
                            onProductCreated={handleProductCreated}
                            onBack={() => setCurrentView('productList')}
                        />
                    </DashboardLayout>
                );
            case 'productValueEntry':
                return (
                    <DashboardLayout 
                        title={selectedProduct?.productName || 'Product'} 
                        subtitle="Manage parameter values for this product"
                        userData={userData} 
                        onLogout={onLogout}
                    >
                        <ProductValueEntry 
                            product={selectedProduct}
                            onBack={() => setCurrentView('productList')}
                        />
                    </DashboardLayout>
                );
            default:
                return (
                    <DashboardLayout 
                        title={`Welcome back, ${userData.tokenId}!`} 
                        subtitle="Manage your products and parameters from this dashboard"
                        userData={userData} 
                        onLogout={onLogout}
                    >
                        <div className="grid grid-cols-2">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                            <i className="fas fa-cube text-primary-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Product Management</h3>
                                            <p className="text-sm text-neutral-600">Create and manage products</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setCurrentView('productList')} 
                                        className="btn btn-primary btn-full"
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                        Manage Products
                                    </button>
                                </div>
                            </div>
                            
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                                            <i className="fas fa-chart-bar text-secondary-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Analytics</h3>
                                            <p className="text-sm text-neutral-600">View product insights</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-secondary btn-full" disabled>
                                        <i className="fas fa-chart-line"></i>
                                        Coming Soon
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DashboardLayout>
                );
        }
    };

    return renderCurrentView();
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleLogin = (data) => {
        setUserData(data);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setUserData(null);
        setIsLoggedIn(false);
    };

    return (
        <div>
            {isLoggedIn ? (
                <Dashboard userData={userData} onLogout={handleLogout} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));