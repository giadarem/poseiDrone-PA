import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { PlanStatus } from "../enum/planStatus";

export class NavigationPlanModel extends Model<
  InferAttributes<NavigationPlanModel>,
  InferCreationAttributes<NavigationPlanModel>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare boatCode: string;
  declare routeWaypoints: any;
  declare startDate: Date;
  declare expectedEndDate: Date | null;
  declare status: PlanStatus;
  declare requestCost: number;
  declare tokensDebited: number;
  declare rejectionReason: string | null;


  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): void {
    NavigationPlanModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        boatCode: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        routeWaypoints: {
          type: DataTypes.GEOMETRY("LINESTRING", 4326),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expectedEndDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(PlanStatus)),
          allowNull: false,
          defaultValue: PlanStatus.Pending,
        },
        requestCost: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 5,
        },
        tokensDebited: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 2,
        },
        rejectionReason: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "navigationPlan",
        modelName: "NavigationPlanModel",
        timestamps: true,
      }
    );
  }
}
