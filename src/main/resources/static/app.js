const { useState, useEffect } = React;

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    tokenId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/login/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => {
          onLogin(data);
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Admin Login</h1>
        <p>Enter your credentials to access the dashboard</p>
      </div>
      {/* login popup */}
      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tokenId">Token ID:</label>
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

        <div className="form-group">
          <label htmlFor="password">Password:</label>
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

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
function ViewProducts(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add useEffect to call fetchTables when component mounts
  useEffect(() => {
    fetchTables();
  }, []);
  
  const fetchTables = async () => {
    try{
      const response = await fetch("/login/productsonly");
      const data = await response.json();
      setProducts(data);
    }catch(error) {
      console.error("Error fetching Products: ", error);
    }finally{
      setLoading(false);
    }
  };
  
  return(
      <div className="dashboard">
        <h1>Your Products</h1>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div>
            {products.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {products.map((product) => (
                  <div key={product.id} style={{
                    padding: "1rem",
                    border: "1px solid #dee2e6",
                    borderRadius: "5px",
                    backgroundColor: "#f8f9fa"
                  }}><button type = "button" className="login-btn">View Parameter Values</button><button type = "button" className="login-btn">View Parameter Values</button>
                    <h3>{product.productName}</h3>
                    <p>{product.parameters ? product.parameters.length : 0} parameters defined</p>
                    <button type = "button" className="login-btn">View Parameter Values</button>
                    <button type = "button" className="login-btn">Edit Parameter Values</button>
                    <button type = "button" className="login-btn">Edit Parameters</button>                    
                  </div>
                ))}
              </div>
            ) : (
              <p>No products found!</p>
            )}
          </div>
        )}
      </div>
  )
}
function ProductDefinition({ onProductCreated }) {
  const [productName, setProductName] = useState("");
  const [parameterCount, setParameterCount] = useState(1);
  const [parameters, setParameters] = useState([
    { parameterName: "", dataType: "String", range: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleParameterCountChange = (e) => {
    const count = parseInt(e.target.value);
    setParameterCount(count);

    // array being declared "newParameters" with many stuff like this -> { parameterName: "", dataType: "String", range: "" }
    const newParameters = [];
    for (let i = 0; i < count; i++) {
      newParameters.push({ parameterName: "", dataType: "String", range: "" });
    }
    setParameters(newParameters);
  };

  const handleParameterChange = (index, field, value) => {
    // copying the existing array "parameters" to newParameters
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  const handleParameterDelete = (index) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/login/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: productName,
          parameters: parameters,
        }),
      });

      const data = await response.json();
      onProductCreated(data);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Define Product Parameters</h1>
      <p>Create a new product and define its parameters</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
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
          <label htmlFor="parameterCount">Number of Parameters:</label>
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

        <div style={{ marginTop: "2rem" }}>
          <h3>Parameter Definitions:</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            {/* thead -> table header section */}
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Parameter Name
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Data Type
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Range
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Delete
                </th>
              </tr>
            </thead>
            {/* tbody -> table body section */}
            <tbody>
              {/* // .map() - is a built in array method that takes these paramaeters - (current_objet_from_array,index_of_parameter) */}
              {parameters.map((param, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    <input
                      type="text"
                      value={param.parameterName}
                      onChange={(e) =>
                        handleParameterChange(
                          index,
                          "parameterName",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Parameter name"
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ced4da",
                        borderRadius: "3px",
                      }}
                    />
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    <select
                      value={param.dataType}
                      onChange={(e) =>
                        handleParameterChange(index, "dataType", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ced4da",
                        borderRadius: "3px",
                      }}
                    >
                      <option value="String">String</option>
                      <option value="Number">Number</option>
                      <option value="Boolean">Boolean</option>
                      <option value="Date">Date</option>
                    </select>
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    <input
                      type="text"
                      value={param.range}
                      onChange={(e) =>
                        handleParameterChange(index, "range", e.target.value)
                      }
                      placeholder="e.g., 1-100, true/false"
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ced4da",
                        borderRadius: "3px",
                      }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleParameterDelete(index)}
                      className="login-btn"
                      style={{ marginRight: "1rem" }}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="login-btn"
          style={{ marginTop: "2rem" }}
          disabled={loading}
        >
          {loading ? "Creating Product..." : "Create Product"}
        </button>
      </form>
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
      console.error("Error fetching values:", error);
    }
  };

  const handleDeleteValue = async (valueId) => {
    try {
      const response = await fetch(`/login/products/${product.id}/values/${valueId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Refresh the saved values after successful deletion
        fetchSavedValues();
      } else {
        console.error("Failed to delete value");
      }
    } catch (error) {
      console.error("Error deleting value:", error);
    }
  };

  const handleAddParameter = () => {
    const newValues = product.parameters.map((param) => ({
      name: "",
      parameterId: param.id,
      value: "",
    }));
    setValues(newValues);
    setShowForm(true);
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...values];
    
    if (field === "name") {
      // If changing the name, update it for all parameters in this row
      newValues.forEach((val, i) => {
        newValues[i] = { ...val, name: value };
      });
    } else {
      // For other fields (like value), update only the specific parameter
      newValues[index][field] = value;
    }
    
    setValues(newValues);
  };

  const handleSaveValues = async () => {
    setLoading(true);
    try {
      await fetch(`/login/products/${product.id}/values`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          values: values,
        }),
      });

      setShowForm(false);
      fetchSavedValues();
    } catch (error) {
      console.error("Error saving values:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Product: {product.productName}</h1>
      <p>Manage parameter values for this product</p>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={handleAddParameter}
          className="login-btn"
          style={{ marginRight: "1rem" }}
        >
          Add Parameter Values
        </button>
        <button onClick={onBack} className="logout-btn">
          Back to Products
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Add New Parameter Values:</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Name
                </th>
                {product.parameters.map((param) => (
                  <th
                    key={param.id}
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #dee2e6",
                      textAlign: "left",
                    }}
                  >
                    {param.parameterName}
                  </th>
                ))}
                <th>
                  Delete 
                </th>
              </tr>
              
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
                  <input
                    type="text"
                    value={values[0]?.name || ""}
                    onChange={(e) =>
                      handleValueChange(0, "name", e.target.value)
                    }
                    placeholder="Enter name"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ced4da",
                      borderRadius: "3px",
                    }}
                  />
                </td>
                {product.parameters.map((param, index) => (
                  <td
                    key={param.id}
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    <input
                      type="text"
                      value={values[index]?.value || ""}
                      onChange={(e) =>
                        handleValueChange(index, "value", e.target.value)
                      }
                      placeholder={`Enter ${param.parameterName}`}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ced4da",
                        borderRadius: "3px",
                      }}
                    />
                  </td>
                ))}
                <td>
                  <button
                    onClick={() => handleDeleteValue(values[0]?.id)}
                    className="login-btn" 
                    style={{ marginRight: "1rem" }}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={handleSaveValues}
            className="login-btn"
            style={{ marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Values"}
          </button>
        </div>
      )}

      {savedValues.length > 0 && (
        <div>
          <h3>Saved Parameter Values:</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Parameter
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  Value
                </th>
                <th>
                  Delete Value
                </th>
              </tr>
            </thead>
            <tbody>
              {savedValues.map((value, index) => (
                <tr key={value.id}>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    {value.name}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    {value.parameterName}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}
                  >
                    {value.value}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteValue(value.id)}
                      className="login-btn"
                      style={{ marginRight: "1rem" }}
                      type="button"
                    >
                      Delete
                    </button>
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

function ProductList({ onProductSelect, onCreateNew, onViewProducts }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/login/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Product Management</h1>
      <p>Select a product to manage or create a new one</p>

      <button
        onClick={onCreateNew}
        className="login-btn"
        style={{ marginBottom: "2rem" }}
      >
        Create New Product
      </button>

      <button
        onClick={onViewProducts}
        className="login-btn"
        style={{ marginBottom: "2rem" }}
      >
        
        View and Edit Products
      </button>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div>
          {products.length > 0 ? (
            <div style={{ display: "grid", gap: "1rem" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: "1rem",
                    border: "1px solid #dee2e6",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: "#f8f9fa",
                  }}
                  onClick={() => onProductSelect(product)}
                >
                  <h3>{product.productName}</h3>
                  <p>{product.parameters.length} parameters defined</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No products found. Create your first product!</p>
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ userData, onLogout }) {
  const [currentView, setCurrentView] = useState("main"); // main, productList, productDefinition, productValueEntry
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductCreated = (product) => {
    setSelectedProduct(product);
    setCurrentView("productValueEntry");
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentView("productValueEntry");
  };

  

  const renderCurrentView = () => {
    switch (currentView) {
      case "productList":
        return (
          <ProductList
            onProductSelect={handleProductSelect}
            onCreateNew={() => setCurrentView("productDefinition")}
            onViewProducts = {() => setCurrentView("viewProducts")}
          />
        );
      case "productDefinition":
        return <ProductDefinition onProductCreated={handleProductCreated} />;
      case "productValueEntry":
        return <ProductValueEntry
            product={selectedProduct}
            onBack={() => setCurrentView("productList")}
          />
        // );
        case "viewProducts":
          return <ViewProducts/>;
      default:
        return (
          <div className="dashboard">
            <h1>Welcome, {userData.tokenId}!</h1>
            <p>You have successfully logged into the admin dashboard.</p>

            <div style={{ marginTop: "2rem" }}>
              <button
                onClick={() => setCurrentView("productList")}
                className="login-btn"
                style={{ marginRight: "1rem" }}
              >
                Manage Products
              </button>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);