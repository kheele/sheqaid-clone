import {computed, makeObservable, observable} from "mobx";
import {IEntity} from "./i_entity"; // Replace with the actual path
import {File} from "./file"; // Replace with the actual path
import {AssetDetail} from "./asset_detail"; // Replace with the actual path
import {Employee} from "./employee"; // Replace with the actual path
import {AssetMonitoringPlan} from "./asset_monitoring_plan"; // Replace with the actual path

export class Asset extends IEntity {
    @observable status?: string;
    @observable writtenOff?: boolean;
    @observable profilePic?: File;
    @observable photoList?: Array<Record<string, any>>;
    @observable assetDetail?: AssetDetail;
    @observable responsiblePerson?: Employee;
    @observable monitoringPlanList?: AssetMonitoringPlan[];

    constructor(data: Partial<Asset> = {}) {
        super({id: data.id});
        makeObservable(this);
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
            ? (data.photo_list as Array<any>).map((e) => e as Record<string, any>)
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
                ? (data.monitoring_plan_list as Array<any>).map((e) =>
                    AssetMonitoringPlan.fromMap(e)
                )
                : undefined,
        });
    }

    toMap(): Record<string, any> {
        return {
            id: this.id,
            status: this.status,
            written_off: this.writtenOff,
            profile_pic: this.profilePic,
            photo_list: this.photoList,
            asset_detail: this.assetDetail,
            responsible_person: this.responsiblePerson,
            monitoring_plan_list: this.monitoringPlanList,
        };
    }

    clone(): Asset {
        return new Asset({
            id: this.id,
            status: this.status,
            writtenOff: this.writtenOff,
            profilePic: this.profilePic,
            photoList: this.photoList,
            assetDetail: this.assetDetail,
            responsiblePerson: this.responsiblePerson,
            monitoringPlanList: this.monitoringPlanList,
        });
    }

    onAutorun(): void {
        if (!this.isNew) {
            // Handle autorun logic
        }
    }

    async save(): Promise<Asset | undefined> {
        throw new Error("Not implemented");
    }
}
