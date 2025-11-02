import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize
} from "sequelize";
import { PlanStatus } from "../enum/planStatus";

/**
 * Interfaccia dei campi della tabella navigation_plans
 */
export interface NavigationPlanAttributes {
  id: number;
  user_id: string;
  boat_id: string;
  route: any; // GEOMETRY (LINESTRING)
  start_date: Date;
  end_date: Date;
  status: PlanStatus;
  rejection_reason?: string | null;
}

/**
 * Modello NavigationPlan
 * ----------------------
 * Gestisce i piani di navigazione dei droni.
 * La motivazione del rifiuto è obbligatoria solo se status = "rejected".
 */
export class NavigationPlanModel extends Model<NavigationPlanAttributes>
  implements NavigationPlanAttributes {
  declare id: CreationOptional<number>;
  declare user_id: string;
  declare boat_id: string;
  declare route: any;
  declare start_date: Date;
  declare end_date: Date;
  declare status: PlanStatus;
  declare rejection_reason?: string | null;

  static initModel(sequelize: Sequelize): void {
    NavigationPlanModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        boat_id: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        route: {
          type: DataTypes.GEOMETRY("LINESTRING", 4326),
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(PlanStatus)),
          allowNull: false,
          defaultValue: PlanStatus.Pending,
        },
        rejection_reason: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            onlyIfRejected(this: NavigationPlanModel, value: string | null) {
              if (this.status === PlanStatus.Rejected && !value) {
                throw new Error("La motivazione è obbligatoria se lo stato è 'rejected'.");
              }
              if (this.status !== PlanStatus.Rejected && value) {
                throw new Error("La motivazione è permessa solo se lo stato è 'rejected'.");
              }
            },
          },
        },
      },
      {
        sequelize,
        modelName: "NavigationPlanModel",
        tableName: "NavigationPlan",
        timestamps: true,
        hooks: {
          beforeValidate: (plan) => {
            if (plan.status === PlanStatus.Rejected && !plan.rejection_reason) {
              throw new Error("Motivazione mancante per stato 'rejected'");
            }
            if (plan.status !== PlanStatus.Rejected) {
              plan.rejection_reason = null;
            }
          },
        },
      }
    );
  }
}
