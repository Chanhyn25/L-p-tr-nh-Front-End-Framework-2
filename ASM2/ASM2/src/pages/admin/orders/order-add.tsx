import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Define a type for form data
interface ProductFormData {
    name: string;
    image: string;
    price: string;
    quality: number;
    description: string;
}

// Define props for the component
interface AddProductPageProps {
    onAdd: (product: ProductFormData) => void;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ onAdd }) => {
    const { register, handleSubmit } = useForm<ProductFormData>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<ProductFormData> = (data) => {
        onAdd(data);
        navigate('/admin/products');
    }

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
    )
}

export default AddProductPage;
