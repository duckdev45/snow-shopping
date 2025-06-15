import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductCardProps {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
}

export function ProductCard({id, name, category, price, imageUrl}: ProductCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
            <Link href={`/products/${id}`} className="block">
                <Image src={imageUrl} alt={name} width={400} height={300} className="w-full h-48 object-cover"/>
            </Link>
            <div className="p-4">
                <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                    <Link href={`/products/${id}`}>{name}</Link>
                </h3>
                <p className="text-gray-500 text-sm mt-1">{category}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-blue-700">
                        NT$ {price.toLocaleString()}
                    </p>
                    <button
                        className="p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
                        <HeartIcon/>
                    </button>
                </div>
            </div>
        </div>
    );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
    )
}
