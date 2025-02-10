import {computed, observable} from "mobx";
import {IEntity} from "./i_entity"; // Replace with the actual path
import {File} from "./file"; // Replace with the actual path
import {AssetDetail} from "./asset_detail"; // Replace with the actual path
import {Employee} from "./employee"; // Replace with the actual path
import {AssetMonitoringPlan} from "./asset_monitoring_plan"; // Replace with the actual path

export class Asset extends IEntity {
    @observable status;
    @observable writtenOff;
    @observable profilePic;
    @observable photoList;
    @observable assetDetail;
    @observable responsiblePerson;
    @observable monitoringPlanList;

    constructor(data: Partial<Asset> = {}) {
        super({id: data.id});

        this.status = data.status;
        this.writtenOff = data.writtenOff;
        this.profilePic = data.profilePic;
        this.photoList = data.photoList;
        this.assetDetail = data.assetDetail;
        this.responsiblePerson = data.responsiblePerson;
        this.monitoringPlanList = data.monitoringPlanList;
    }

    @computed get lastMonitoringPlan(): AssetMonitoringPlan | undefined {
        return this.monitoringPlanList?.[this.monitoringPlanList.length - 1];
    }

    static fromMap(data: Record<string, any>): Asset {
        const photoList = data.photo_list
            ? data.photo_list.map((e) => e)
            : undefined;

        const profilePic =
            photoList && (!data.profile_pic || data.profile_pic.length === 0)
                ? photoList.length > 0
                    ? File.fromMap(photoList[0])
                    : undefined
                : File.fromMap(data.profile_pic?.[0]);

        return new Asset({
            id: data.id,
            status: data.status,
            writtenOff: data.written_off,
            profilePic: profilePic,
            photoList: photoList,
            assetDetail: data.asset_detail
                ? AssetDetail.fromMap(data.asset_detail)
                : undefined,
            responsiblePerson: data.responsible_person
                ? Employee.fromMap(data.responsible_person)
                : undefined,
            monitoringPlanList: data.monitoring_plan_list
                ? data.monitoring_plan_list.map((e) =>
                    AssetMonitoringPlan.fromMap(e)
                )
                : undefined,
        });
    }

}
