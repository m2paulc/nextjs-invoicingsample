"use client";

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type LineItem = {
	description: string;
	quantity: number;
	price: number;
};

type InvoiceFormValues = {
	customerName: string;
	customerEmail: string;
	lineItems: LineItem[];
};

// Validation schema
const schema = Yup.object({
	customerName: Yup.string().required("Customer name is required"),
	customerEmail: Yup.string()
		.email("Invalid email")
		.required("Customer email is required"),
	lineItems: Yup.array()
		.of(
			Yup.object({
				description: Yup.string().required("Description is required"),
				quantity: Yup.number().min(1).required("Quantity is required"),
				price: Yup.number().min(0.01).required("Price is required"),
			})
		)
		.required("Must have at least one line item")
		.min(1, "At least one line item is required"), // Ensure at least one item exists
});

export default function InvoiceForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm<InvoiceFormValues>({
		resolver: yupResolver(schema),
		defaultValues: {
			customerName: "",
			customerEmail: "",
			lineItems: [], // Fix: Ensure this is always an empty array initially
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "lineItems",
	});

	const onSubmit: SubmitHandler<InvoiceFormValues> = (data) => {
		console.log("Invoice Data:", data);
		reset(); // Reset after successful submission
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6">Create Invoice</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Main Form */}
				<div className="mb-4">
					<label className="block font-medium mb-2">Customer Name</label>
					<input
						{...register("customerName")}
						className="w-full p-2 border rounded"
						placeholder="John Doe"
					/>
					{errors.customerName && (
						<p className="text-red-500">{errors.customerName.message}</p>
					)}
				</div>

				<div className="mb-4">
					<label className="block font-medium mb-2">Customer Email</label>
					<input
						{...register("customerEmail")}
						type="email"
						className="w-full p-2 border rounded"
						placeholder="john@example.com"
					/>
					{errors.customerEmail && (
						<p className="text-red-500">{errors.customerEmail.message}</p>
					)}
				</div>

				{/* Subform: Line Items */}
				<div className="mt-6">
					<h2 className="text-xl font-bold mb-4">Line Items</h2>
					<table className="w-full table-auto border-collapse mb-4">
						<thead>
							<tr>
								<th className="px-4 py-2 border">Description</th>
								<th className="px-4 py-2 border">Quantity</th>
								<th className="px-4 py-2 border">Price</th>
								<th className="px-4 py-2 border">Actions</th>
							</tr>
						</thead>
						<tbody>
							{fields.map((field, index) => (
								<tr key={field.id}>
									<td className="px-4 py-2 border">
										<input
											{...register(`lineItems.${index}.description` as const)}
											className="w-full p-2 border rounded"
											placeholder="Item description"
										/>
										{errors.lineItems?.[index]?.description && (
											<p className="text-red-500">
												{errors.lineItems[index]?.description?.message}
											</p>
										)}
									</td>
									<td className="px-4 py-2 border">
										<input
											{...register(`lineItems.${index}.quantity` as const)}
											type="number"
											className="w-full p-2 border rounded"
											placeholder="Quantity"
										/>
										{errors.lineItems?.[index]?.quantity && (
											<p className="text-red-500">
												{errors.lineItems[index]?.quantity?.message}
											</p>
										)}
									</td>
									<td className="px-4 py-2 border">
										<input
											{...register(`lineItems.${index}.price` as const)}
											type="number"
											step="0.01"
											className="w-full p-2 border rounded"
											placeholder="Price"
										/>
										{errors.lineItems?.[index]?.price && (
											<p className="text-red-500">
												{errors.lineItems[index]?.price?.message}
											</p>
										)}
									</td>
									<td className="px-4 py-2 border text-center">
										<button
											type="button"
											onClick={() => remove(index)}
											className="bg-red-500 text-white px-3 py-1 rounded"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<button
						type="button"
						onClick={() => append({ description: "", quantity: 1, price: 0 })}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Add Line Item
					</button>
				</div>

				{/* Submit Button */}
				<div className="mt-6">
					<button
						type="submit"
						className="bg-green-500 text-white px-4 py-2 rounded"
					>
						Submit Invoice
					</button>
				</div>
			</form>
		</div>
	);
}
