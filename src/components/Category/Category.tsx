/* eslint-disable @next/next/no-async-client-component */
"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import { useGetAllCategoryQuery } from "@/src/redux/features/category/categoryApi";

const Category = async () => {

    const { data: categoryData } = useGetAllCategoryQuery(undefined);
    console.log(categoryData);

    return (
        <div>
            this is category
        </div>
    );
};

export default Category;