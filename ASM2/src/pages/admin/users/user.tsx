import React from 'react';
import { Link } from 'react-router-dom';

// Define a type for product data
interface Product {
    id: number;
    name: string;
    image: string;
    price: string;
    quality: number;
    description: string;
}

// Define props for the component
interface ProductPageProps {
    onRemove: (id: number) => void;
    products: Product[];
}

const ProductPage: React.FC<ProductPageProps> = ({ onRemove, products }) => {
    return (
        <>
            <h2>Danh sách sản phẩm</h2>
            <div className="table-responsive small">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Ảnh</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Giá sản phẩm</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td><img src={product.image} alt={product.name} style={{ width: '50px' }} /></td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quality}</td>
                                <td>{product.description}</td>
                                <td>
                                    <div className='d-flex'>
                                        <button className='btn btn-danger' onClick={() => onRemove(product.id)}>Xóa</button>
                                        <Link className='btn btn-primary ml-3' to={`/admin/products/${product.id}/edit`}>Cập nhập</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ProductPage;
