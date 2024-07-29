import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../api/product';

// Define a type for form data
interface ProductFormData {
    id: number;
    name: string;
    image: string;
    price: string;
    quality: number;
    description: string;
}

interface ProductFixPageProps {
    onUpdate: (product: ProductFormData) => void;
}

const ProductFixPage: React.FC<ProductFixPageProps> = ({ onUpdate }) => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset } = useForm<ProductFormData>();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (id) {
                const data = await getProductById(id);
                reset(data);
            }
        })();
    }, [id, reset]);
    const onSubmit: SubmitHandler<ProductFormData> = (data) => {
        onUpdate(data);
        navigate('/admin/products');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 mt-5">
                <label htmlFor="productName" className="form-label">Tên sản phẩm</label>
                <input type="text" {...register("name")} className="form-control" id="productName" />
            </div>
            <div className="mb-3">
                <label htmlFor="productImage" className="form-label">Ảnh sản phẩm</label>
                <input type="text" {...register("image")} className="form-control" id="productImage" />
            </div>
            <div className="mb-3">
                <label htmlFor="productPrice" className="form-label">Giá sản phẩm</label>
                <input type="text" {...register("price")} className="form-control" id="productPrice" />
            </div>
            <div className="mb-3">
                <label htmlFor="productQuality" className="form-label">Số lượng</label>
                <input type="number" {...register("quality")} className="form-control" id="productQuality" />
            </div>
            <div className="mb-3 mt-5">
                <label htmlFor="productDesc" className="form-label">Mô tả</label>
                <textarea className="form-control" id="productDesc" {...register("description")} cols={30} rows={10}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default ProductFixPage;
