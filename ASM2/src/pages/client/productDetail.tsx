import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ProductDetail {
    id: number;
    name: string;
    description: string;
    quantity: number;
    category: number;
    price: number;
    image: string;
}

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductDetail | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`http://localhost:3000/products/${id}`);
            const data: ProductDetail = await response.json();
            setProduct(data);
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <img src={`../${product.image}`} alt={product.name} className="w-full h-64 object-cover mb-4 rounded" />
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-700 mb-2">Quantity: {product.quantity}</p>
            <p className="text-gray-700 mb-2">Category: {product.category}</p>
            <p className="text-gray-900 font-semibold">Price: ${product.price}</p>
        </div>
    );
};

export default ProductDetail;
