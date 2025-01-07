import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { products, sexes, sizes } = usePage().props; // Get products from the props

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products list
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-600">
                            <h1 className='text-xl font-bold'>Products list</h1>
                            {products.map(product => (
                                <div key={product.id}>{product.name} with sizes {product.sizes?.map(
                                    size => (<span className='pl-1'>{size.name}</span>)
                                )} for {product.sex ? product.sex.name : "Not specified"} from category {product.category?.name}</div>
                            ))}

                            <h1 className='text-xl font-bold'>Sexes list</h1>
                            {sexes.map(sex => (
                                <div key={sex.id}>{sex.name}</div>
                            ))}

                            <h1 className='text-xl font-bold'>Sizes list</h1>
                            {sizes.map(size => (
                                <div key={size.id}>{size.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
