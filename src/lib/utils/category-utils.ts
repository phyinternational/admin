/**
 * Utility function for category nesting display
 * Recursively builds a nested label for categories with parent-child relationships
 */
export const nestedLabel = (category: any, categoriesData: any): any => {
  if (category.parentId) {
    const parentCategory = categoriesData.find((cat: { _id: any; }) => cat._id === category.parentId);
    if (parentCategory) {
      const parentLabel = nestedLabel(parentCategory, categoriesData);
      return `${parentLabel} > ${category.name}`;
    }
  }
  return category.name;
};
