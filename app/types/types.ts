export type LineItem = {
	description: string;
	quantity: number;
	price: number;
};

export type InvoiceFormValues = {
	invoiceId: string;
	customerName: string;
	customerEmail: string;
	lineItems: LineItem[];
};
