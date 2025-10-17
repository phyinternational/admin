import { useState } from "react";
import { Button } from "../ui/button";
import { parseXLSXFile } from "@/lib/exel";
import UploadBox from "../ui/upload-document";
import { useAddVariantBulk } from "@/lib/react-query/product-query";
import Product from "./product";

const UploadVarients = () => {
  const [importAllData, setImportAllData] = useState<any>(null);
  const { isPending, mutate } = useAddVariantBulk();

  const handleUpload = () => {
    if (!importAllData) return;
    const products = importAllData.importData;
    const product = createProductWithVariants(products);
    mutate({ varients: product.varients, skuNo: product.skuNo });
  };
  const handleDropSheet = (acceptedFiles: any[]) => {
    const file = acceptedFiles[0];

    if (file) {
      parseXLSXFile(file)
        .then((result: any) => {
          setImportAllData(result);
        })
        .catch((error) => {
          console.error("Error parsing XLSX file:", error);
        });
    }
  };

  return (
    <>
      <h1 className="text-xl mb-4 font-semibold">Upload Products</h1>
      <section>
        <div>
          <UploadBox
            onDrop={handleDropSheet}
            placeholder={
              <div className="flex items-center flex-col space-y-2">
                <p>Drag & Drop or import file here</p>
                <Button variant="outline">Browse File</Button>
                <p>File format must be .xlsx</p>
              </div>
            }
          />
          {importAllData && (
            <div>
              <p>
                {" "}
                Product Varients are selected :{" "}
                {importAllData.importData.length}
              </p>
            </div>
          )}
          <div className="mt-4">
            <Button
              disabled={isPending || !importAllData}
              onClick={() => handleUpload()}
            >
              {isPending
                ? "Uploading..."
                : importAllData
                ? "Upload"
                : "Select File"}
            </Button>
          </div>
        </div>
        <main className="mt-10 bg-white rounded-xl p-4">
          <div>
            <h2 className="text-xl font-semibold">Preview</h2>
            {importAllData && (
              <div className="flex flex-col space-y-2 mt-4 font-medium">
                <span>
                  {" "}
                  Product Name : {importAllData.importData[0]["PRODUCT NAME"]}
                </span>
                <span>
                  {" "}
                  Product Code : {importAllData.importData[0]["CODE"]}
                </span>
                <span> Product MRP : {importAllData.importData[0]["MRP"]}</span>
                <span>
                  {" "}
                  Product Selling Price :{" "}
                  {importAllData.importData[0]["SELLING PRICE"]}
                </span>
                <span>
                  {" "}
                  Product Description :{" "}
                  {importAllData.importData[0]["DESCRIPTION"]}
                </span>
                <span>
                  {" "}
                  Product Brand : {importAllData.importData[0]["BRAND"]}
                </span>
              </div>
            )}
          </div>
        </main>
      </section>
    </>
  );
};

export default UploadVarients;

function createProductWithVariants(productsData: any[]): Product {
  if (productsData.length === 0) {
    throw new Error("No product data available");
  }

  const mainProductData = productsData[0];

  const product: Product = {
    productTitle: mainProductData["PRODUCT NAME"],
    productSlug: mainProductData["CODE"],
    skuNo: mainProductData["CODE"],
    isActive: true,
    regularPrice: Number(mainProductData["MRP"]),
    productImageUrl: mainProductData["Main Image URL"],
    salePrice: Number(mainProductData["SELLING PRICE"]),
    productDescription: mainProductData["DESCRIPTION"],
    brand: mainProductData["BRAND"],
    varients: [],
    images: [],
  };

  const productImages = () => {
    const productMap = new Map();

    productsData.forEach((productData) => {
      if (productData["Main Image URL"]) {
        const images = [productData["Main Image URL"]]; // Initialize images array with main image URL
        let i = 1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (productData[`Other Image URL ${i}`]) {
            images.push(productData[`Other Image URL ${i}`]); // Add other image URLs to images array
            i++; // Increment i
          } else {
            break;
          }
        }
        productMap.set(productData["COLOR"], images); // Set color as key and images array as value in the productMap
      }
    });

    return productMap;
  };

  const imagesMap = productImages();

  imagesMap.forEach((images, color) => {
    if (product.images) product.images.push({ color, images });
  });

  productsData.forEach((productData) => {
    const variant: any = {
      size: productData["SIZE"],
      price: Number(productData["MRP"]),
      salePrice: Number(productData["SELLING PRICE"]),
      stock: parseInt(productData["QTY"]),
      color: productData["COLOR"],
      sku: productData["SKU"],
    };

    if (product.varients) product.varients.push(variant);
  });

  return product;
}
