
<link
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    rel="stylesheet"
/>
const Dashboard = () => {
    return (
        <div className="d-flex flex-column pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="d-flex justify-content-between">
                <a href="/" className="link-black">admin</a>
                <a href="/admin/products/add" className="link-black">Add</a>
                <a href="/login" className="link-black">Login</a>
                <a href="/register" className="link-black">Register</a>
            </div>
        </div>
    )
}

export default Dashboard