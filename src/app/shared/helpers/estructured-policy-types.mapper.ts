import { EstructuredPolicyCategoryModel } from '../interfaces/models/policy-category.model';
import { PopulatedPolicyTypeModel } from '../interfaces/models/policy-type.model';

export const mapEstructuredPolicyCategories = (
  policy_types: PopulatedPolicyTypeModel[]
): EstructuredPolicyCategoryModel[] => {
  const categories: EstructuredPolicyCategoryModel[] = [];

  policy_types.forEach(item => {
    const category_index: number = categories.findIndex(
      cat => cat._id === item.policy_category_id
    );

    if (category_index >= 0) {
      const business_line_index: number = categories[
        category_index
      ].business_lines.findIndex(line => line._id === item.business_line_id);

      business_line_index >= 0
        ? categories[category_index]?.business_lines[
            business_line_index
          ]?.policy_types.push(item)
        : categories[category_index].business_lines.push({
            ...item.business_line,
            policy_types: [item],
          });
    } else {
      categories.push({
        ...item.policy_category,
        business_lines: [{ ...item.business_line, policy_types: [item] }],
      });
    }
  });

  return categories;
};
