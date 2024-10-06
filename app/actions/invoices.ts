"use server";

import db from "@/db/db";
import { InvoiceFormValues } from "@/app/types/types";

export async function createInvoice(formData: InvoiceFormValues) {
	try {
		// Start a transaction to ensure both operations either succeed or fail together
		const result = await db.$transaction(async (tx) => {
			// 1. Create the main invoice
			const invoice = await tx.invoice.create({
				data: {
					invoiceId: formData.invoiceId as string,
					customerName: formData.customerName as string,
					customerEmail: formData.customerEmail as string,
				},
			});
			// 2. Create the line items (Parts) and associate with the invoiceId
			await tx.parts.createMany({
				data: formData.lineItems.map((item) => ({
					description: item.description,
					quantity: item.quantity,
					priceInCents: item.price,
					invoiceId: invoice.invoiceId, // Link the parts with the newly created invoice
				})),
			});

			return invoice;
		});

		return result;
	} catch (error) {
		console.error("Error creating invoice:", error);
		alert("An error occurred while creating the invoice");
	}
}
