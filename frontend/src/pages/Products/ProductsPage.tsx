import { useState } from "react";

import Typography from "@mui/material/Typography";

import TableToolbar from "../../components/table/TableToolbar";
import DataTable from "../../components/table/DataTable";
import FormDialog from "../../components/common/FormDialog";

import ProductForm from "./components/ProductForm";

import { useProducts } from "../../hooks/useProducts";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import type { PriceType } from "./components/ProductForm";

import { useAuth } from "../auth/AuthContext";

export default function ProductsPage() {

    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [product, setProduct] = useState({
        supplierId: 0,
        name: "",
        purchasePrice: 0,
        minimumStock: 0,
        prices: [
            { type: "MINORISTA" as PriceType, price: 0, minimumQuantity: 1 },
            { type: "MAYORISTA" as PriceType, price: 0, minimumQuantity: 12 },
        ],
    });

    const [editingId, setEditingId] = useState<number | null>(null);

    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

    const { data: products = [] } = useProducts(search);

    const handleEdit = (row: any) => {

        setEditingId(row.id);

        setProduct({
            supplierId: row.supplierId,
            name: row.name,
            purchasePrice: Number(row.purchasePrice),
            minimumStock: row.minimumStock,
            prices: row.prices ?? [],
        });

        setOpen(true);
    };

    const handleDelete = async (row: any) => {

        const confirmDelete = window.confirm(
            `¿Desea eliminar el producto "${row.name}"?`
        );

        if (!confirmDelete) return;

        try {
            await deleteProduct.mutateAsync(row.id);
            alert("Producto eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el producto");
        }
    };

    const handleSave = async () => {

        try {

            if (editingId) {

                if (!product.name.trim()) {
                    alert("Debe ingresar el nombre.");
                    return;
                }

                if (product.supplierId <= 0) {
                    alert("Debe seleccionar un proveedor.");
                    return;
                }

                if (product.purchasePrice <= 0) {
                    alert("El precio de compra debe ser mayor a 0.");
                    return;
                }

                for (const price of product.prices) {
                    if (price.price <= 0) {
                        alert(`El precio ${price.type} es inválido.`);
                        return;
                    }
                }

                await updateProduct.mutateAsync({ id: editingId, dto: product });

                alert("Producto actualizado");

            } else {

                await createProduct.mutateAsync(product);
                alert("Producto registrado");
            }

            setOpen(false);
            setEditingId(null);

            setProduct({
                supplierId: 0,
                name: "",
                purchasePrice: 0,
                minimumStock: 0,
                prices: [
                    { type: "MINORISTA", price: 0, minimumQuantity: 1 },
                    { type: "MAYORISTA", price: 0, minimumQuantity: 12 },
                ],
            });

        } catch (error) {
            console.error(error);
            alert("Error");
        }
    };

    const columns = [
        { field: "code", headerName: "Código", flex: 1 },
        { field: "name", headerName: "Producto", flex: 2 },
        { field: "purchasePrice", headerName: "Compra", flex: 1 },
        { field: "salePrice", headerName: "Venta", flex: 1 },
        {
            field: "stock",
            headerName: "Stock",
            render: (row: any) => (
                <span
                    style={{
                        color: row.stock <= row.minimumStock ? "red" : "inherit",
                        fontWeight: row.stock <= row.minimumStock ? "bold" : "normal",
                    }}
                >
                    {row.stock}
                </span>
            ),
        },
        { field: "minimumStock", headerName: "Stock mínimo", flex: 1 },
    ];

    const rows = products.map((product: any) => ({
        id: product.id,
        supplierId: product.supplierId,
        code: product.code,
        name: product.name,
        purchasePrice: Number(product.purchasePrice),
        salePrice: product.prices?.find((p: any) => p.type === "MINORISTA")?.price ?? 0,
        stock: product.stock,
        minimumStock: product.minimumStock,
        prices: product.prices,
    }));

    return (

        <>

            <Typography variant="h4" mb={3}>
                Productos
            </Typography>

            <TableToolbar
                title="Productos"
                search={search}
                onSearchChange={setSearch}
                onNew={
                    isAdmin
                        ? () => {
                            setEditingId(null);
                            setProduct({
                                supplierId: 0,
                                name: "",
                                purchasePrice: 0,
                                minimumStock: 0,
                                prices: [
                                    { type: "MINORISTA", price: 0, minimumQuantity: 1 },
                                    { type: "MAYORISTA", price: 0, minimumQuantity: 12 },
                                ],
                            });
                            setOpen(true);
                        }
                        : undefined
                }
            />

            <DataTable
                columns={columns}
                rows={rows}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
            />

            {isAdmin && (
                <FormDialog
                    open={open}
                    title="Nuevo producto"
                    onClose={() => setOpen(false)}
                    onSave={handleSave}
                >
                    <ProductForm value={product} onChange={setProduct} />
                </FormDialog>
            )}

        </>

    );

}