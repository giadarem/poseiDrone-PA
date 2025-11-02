/**
 * 
 * Rappresenta un'area vietata (bounding box rettangolare)
 * definita da due coppie di coordinate geografiche.
 * Può avere una data di inizio e fine validità (opzionali).
 */

import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
} from "sequelize";

export interface ForbiddenAreaAttributes {
  id: number;
  name: string;
  bbox: any; // GEOMETRY (POLYGON)
  valid_from?: Date | null;
  valid_to?: Date | null;
}

export class ForbiddenAreaModel
  extends Model<ForbiddenAreaAttributes>
  implements ForbiddenAreaAttributes
{
  declare id: CreationOptional<number>;
  declare name: string;
  declare bbox: any;
  declare valid_from?: Date | null;
  declare valid_to?: Date | null;

  static initModel(sequelize: Sequelize): void {
    ForbiddenAreaModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: "Nome o descrizione dell'area vietata",
        },
        bbox: {
          type: DataTypes.GEOMETRY("POLYGON", 4326),
          allowNull: false,
          comment: "Rettangolo geografico (bounding box) in formato POLYGON",
        },
        valid_from: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        valid_to: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "ForbiddenAreaModel",
        tableName: "forbidden_areas",
        timestamps: false,
      }
    );
  }
}
