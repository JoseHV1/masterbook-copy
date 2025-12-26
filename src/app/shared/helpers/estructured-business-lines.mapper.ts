import { EstructuredBusinessLineModel } from '../interfaces/models/business-line.model';
import { PopulatedPolicyTypeModel } from '../interfaces/models/policy-type.model';

export const mapEstructuredBusinessLines = (
  policy_types: PopulatedPolicyTypeModel[]
): EstructuredBusinessLineModel[] => {
  const business_lines: EstructuredBusinessLineModel[] = [];

  policy_types.forEach(item => {
    const business_line_index: number = business_lines.findIndex(
      line => line._id === item.business_line_id
    );

    business_line_index >= 0
      ? business_lines[business_line_index]?.policy_types.push(item)
      : business_lines.push({
          ...item.business_line,
          policy_types: [item],
        });
  });

  return business_lines;
};
