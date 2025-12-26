// import {
//   InsurerBackEntity,
//   InsurerCommissionsPercentBackEntity,
// } from './insurer.back-entity';
// import { InsurerCommissionsPercentModel, InsurerModel } from './insurer.model';

// export class InsurerDTO {
//   public static mapTo(param: InsurerBackEntity): InsurerModel {
//     return {
//       business_line: param.business_line,
//       commissions_percent: this._commissionsPercentToModel(
//         param.commissions_percent
//       ),
//       created_at: param.created_at ? new Date(param.created_at) : new Date(),
//       direction: param.direction,
//       email: param.email,
//       fax: param.fax,
//       id: param.id,
//       insurer_custom_name: param.insurer_custom_name,
//       name: param.name,
//       phones: param.phones,
//       status: param.status,
//       updated_at: param.updated_at ? new Date(param.updated_at) : new Date(),
//     };
//   }

//   public static mapFrom(param: InsurerModel): InsurerBackEntity {
//     return {
//       business_line: param.business_line,
//       commissions_percent: this._commissionsPercentToEntity(
//         param.commissions_percent
//       ),
//       created_at: param.created_at ? param.created_at.toISOString() : '',
//       direction: param.direction,
//       email: param.email,
//       fax: param.fax,
//       id: param.id,
//       insurer_custom_name: param.insurer_custom_name,
//       name: param.name,
//       phones: param.phones,
//       status: param.status,
//       updated_at: param.updated_at ? param.updated_at.toISOString() : '',
//     };
//   }

//   private static _commissionsPercentToModel(
//     commissions_percent: InsurerCommissionsPercentBackEntity
//   ): InsurerCommissionsPercentModel[] {
//     const transformed: InsurerCommissionsPercentModel[] = [];

//     Object.entries(commissions_percent).forEach(element => {
//       transformed.push({
//         name: element[0],
//         values: element[1],
//       });
//     });

//     return transformed;
//   }

//   private static _commissionsPercentToEntity(
//     commissions_percent: InsurerCommissionsPercentModel[]
//   ): InsurerCommissionsPercentBackEntity {
//     const transformed: InsurerCommissionsPercentBackEntity = {};

//     commissions_percent.forEach(element => {
//       transformed[element.name] = element.values;
//     });

//     return transformed;
//   }
// }
