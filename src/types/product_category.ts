export interface EntityReference {
	entityId: string,
	name: string,
}

export default interface Ce_productCategory {
	description?: string,
	name: string,
	c_relatedBlogs?: EntityReference[],
	c_relatedFAQs?: EntityReference[],
	c_relatedProducts?: EntityReference[],
	id: string,
}
